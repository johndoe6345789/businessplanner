"""Xero / Zelt plumbing: signed OAuth state, report reshaping and the Zelt address allow-list."""
import asyncio

import pytest

from app import integrations as ig
from app.core import ApiError


@pytest.fixture(autouse=True)
def env(monkeypatch):
    monkeypatch.setenv("INTEGRATION_STATE_SECRET", "s3cret")
    monkeypatch.setenv("ZELT_ALLOWED_BASES", "https://api.zelt.app, http://zelt-surrogate:9021/")
    monkeypatch.delenv("ZELT_DEFAULT_BASE_URL", raising=False)


def test_state_round_trips_and_names_the_owner():
    assert ig.read_state(ig.sign_state("owner-1")) == "owner-1"


def test_state_cannot_be_forged_altered_or_reused_late(monkeypatch):
    good = ig.sign_state("owner-1", now=1000, ttl=600)
    payload, sig = good.rsplit(".", 1)
    for bad in (payload + "." + "0" * 32, "x" + good, "", "no-dot", payload + "A." + sig):
        with pytest.raises(ApiError):
            ig.read_state(bad, now=1001)
    with pytest.raises(ApiError):
        ig.read_state(good, now=1601)                                   # expired
    monkeypatch.setenv("INTEGRATION_STATE_SECRET", "other")
    with pytest.raises(ApiError):
        ig.read_state(good, now=1001)                                   # signed with another secret


def test_authorize_url_carries_client_redirect_scope_and_state(monkeypatch):
    monkeypatch.setenv("XERO_CLIENT_ID", "cid"); monkeypatch.setenv("XERO_REDIRECT_URI", "https://x.example/api/xero/callback")
    monkeypatch.setenv("XERO_AUTHORIZE_URL", "https://demo.example/identity/connect/authorize")
    url = ig.xero_authorize_url("owner-1")
    assert url.startswith("https://demo.example/identity/connect/authorize?response_type=code&client_id=cid")
    assert "accounting.reports.read" in url and "offline_access" in url
    assert ig.read_state(url.split("state=")[1]) == "owner-1"


def test_configured_only_with_all_three_settings(monkeypatch):
    for k in ("XERO_CLIENT_ID", "XERO_CLIENT_SECRET", "INTEGRATION_STATE_SECRET"):
        monkeypatch.delenv(k, raising=False)
    assert not ig.xero_configured()
    monkeypatch.setenv("XERO_CLIENT_ID", "a"); monkeypatch.setenv("XERO_CLIENT_SECRET", "b"); monkeypatch.setenv("INTEGRATION_STATE_SECRET", "c")
    assert ig.xero_configured()


def test_zelt_address_must_be_on_the_list():
    assert ig.zelt_base(None) == "https://api.zelt.app"
    assert ig.zelt_base("http://zelt-surrogate:9021/") == "http://zelt-surrogate:9021"
    for evil in ("http://169.254.169.254", "http://businessplanner-db:5432", "https://api.zelt.app.evil.example", "file:///etc/passwd"):
        with pytest.raises(ApiError) as e:
            ig.zelt_base(evil)
        assert e.value.status == 400


def test_default_zelt_address_can_be_set(monkeypatch):
    monkeypatch.setenv("ZELT_DEFAULT_BASE_URL", "http://zelt-surrogate:9021")
    assert ig.zelt_base(None) == "http://zelt-surrogate:9021"


def test_report_rows_are_flattened_with_lowercase_keys():
    xero = {"Reports": [{"ReportID": "r", "ReportName": "Profit and Loss", "Rows": [
        {"RowType": "Header", "Cells": [{"Value": ""}, {"Value": "Now"}]},
        {"RowType": "Section", "Title": "Income", "Rows": [
            {"RowType": "Row", "Cells": [{"Value": "Sales"}, {"Value": "10.00"}]},
            {"RowType": "SummaryRow", "Cells": [{"Value": "Total Income"}, {"Value": "10.00"}]}]}]}]}
    rows = ig.flatten_report(xero)["Reports"][0]["Rows"]
    assert [r["rowType"] for r in rows] == ["Header", "Section", "Row", "SummaryRow"]
    total = rows[-1]
    assert total["cells"] == [{"value": "Total Income"}, {"value": "10.00"}]       # what extractReportRow looks for


def test_zelt_get_unwraps_data_and_maps_auth_failures(monkeypatch):
    import httpx

    def handler(request):
        if request.headers.get("x-api-key") != "good":
            return httpx.Response(401)
        return httpx.Response(200, json={"data": [{"id": 1}]})

    async def run(key):
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as c:
            return await ig.zelt_get(c, "http://zelt-surrogate:9021", key, "/v1/employees")
    assert asyncio.run(run("good")) == [{"id": 1}]
    with pytest.raises(ApiError) as e:
        asyncio.run(run("bad"))
    assert e.value.status == 401
