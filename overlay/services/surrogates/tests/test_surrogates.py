"""The stand-ins behave like the services they stand in for, closely enough for the planner's calls."""
import base64
import datetime as dt
import urllib.parse

from fastapi.testclient import TestClient

from app import data, xero, zelt

X = TestClient(xero.app, follow_redirects=False)
Z = TestClient(zelt.app)
BASIC = {"Authorization": "Basic " + base64.b64encode(f"{xero.CLIENT_ID}:{xero.CLIENT_SECRET}".encode()).decode()}
CB = xero.REDIRECTS[0]


def code_for(decision="allow"):
    r = X.post("/identity/connect/decision", data={"client_id": xero.CLIENT_ID, "redirect_uri": CB, "state": "S1", "decision": decision})
    assert r.status_code == 303
    return dict(urllib.parse.parse_qsl(urllib.parse.urlparse(r.headers["location"]).query))


def tokens():
    q = code_for()
    assert q["state"] == "S1"
    r = X.post("/identity/connect/token", headers=BASIC, data={"grant_type": "authorization_code", "code": q["code"], "redirect_uri": CB})
    assert r.status_code == 200
    return r.json()


def test_consent_page_says_it_is_a_demo_and_rejects_unknown_apps():
    ok = X.get("/identity/connect/authorize", params={"response_type": "code", "client_id": xero.CLIENT_ID, "redirect_uri": CB, "state": "S1"})
    assert ok.status_code == 200 and "not Xero" in ok.text
    assert X.get("/identity/connect/authorize", params={"response_type": "code", "client_id": "evil", "redirect_uri": CB}).status_code == 400
    assert X.get("/identity/connect/authorize", params={"response_type": "code", "client_id": xero.CLIENT_ID, "redirect_uri": "https://evil.example/cb"}).status_code == 400


def test_deny_sends_access_denied_with_the_state():
    assert code_for("deny") == {"state": "S1", "error": "access_denied"}


def test_token_exchange_and_refresh_and_wrong_secret():
    t = tokens()
    assert t["expires_in"] == 1800
    r = X.post("/identity/connect/token", headers=BASIC, data={"grant_type": "refresh_token", "refresh_token": t["refresh_token"]})
    assert r.status_code == 200 and r.json()["access_token"]
    assert X.post("/identity/connect/token", headers={"Authorization": "Basic " + base64.b64encode(b"x:y").decode()}, data={"grant_type": "refresh_token"}).status_code == 401
    assert X.post("/identity/connect/token", headers=BASIC, data={"grant_type": "authorization_code", "code": "bad", "redirect_uri": CB}).status_code == 400
    assert X.post("/identity/connect/token", headers=BASIC, data={"grant_type": "refresh_token", "refresh_token": t["access_token"]}).status_code == 400


def test_accounting_calls_need_a_token_and_the_right_tenant():
    t = tokens(); auth = {"Authorization": "Bearer " + t["access_token"]}
    tenant = X.get("/connections", headers=auth).json()[0]["tenantId"]
    assert X.get("/api.xro/2.0/Invoices").status_code == 401
    assert X.get("/api.xro/2.0/Invoices", headers=auth).status_code == 403
    inv = X.get("/api.xro/2.0/Invoices", headers={**auth, "xero-tenant-id": tenant}).json()["Invoices"]
    assert inv and {"InvoiceID", "InvoiceNumber", "Contact", "DateString", "DueDateString", "AmountDue", "AmountPaid", "Total", "Status", "CurrencyCode"} <= set(inv[0])
    assert X.get("/api.xro/2.0/Reports/Nonsense", headers={**auth, "xero-tenant-id": tenant}).status_code == 404


def test_reports_have_the_rows_the_dashboard_reads():
    rows = data.report("ProfitAndLoss")["Reports"][0]["Rows"]
    summaries = {r["Cells"][0]["Value"] for s in rows for r in s.get("Rows", []) if r["RowType"] == "SummaryRow"}
    assert "Total Income" in summaries
    assert "Cash position" in {r["Cells"][0]["Value"] for s in data.report("ExecutiveSummary")["Reports"][0]["Rows"] for r in s.get("Rows", [])}


def test_sample_data_is_consistent():
    today = dt.date(2026, 10, 20)
    inv = data.invoices(today)
    assert all(i["AmountDue"] + i["AmountPaid"] == i["Total"] for i in inv)
    assert any(i["Status"] == "AUTHORISED" for i in inv) and any(i["Status"] == "PAID" for i in inv)
    assert all(dt.date.fromisoformat(t["DateString"][:10]) <= today for t in data.bank_transactions(today))
    assert data.invoices(today) == data.invoices(today)               # deterministic


def test_zelt_needs_the_demo_key_and_returns_the_shapes_the_app_expects():
    assert Z.get("/v1/employees").status_code == 401
    h = {"X-API-Key": zelt.KEY}
    emp = Z.get("/v1/employees", headers=h).json()
    assert {"id", "name", "role", "department", "monthlyCostGbp", "startDate"} <= set(emp[0])
    run = Z.get("/v1/payroll/runs", headers=h).json()[0]
    assert {"id", "period", "totalGross", "totalEmployerNi", "totalPension", "totalCost", "employeeCount"} <= set(run)
    assert Z.get("/v1/leave/requests", headers=h).json()[0]["status"] in ("PENDING", "APPROVED", "DECLINED")
    assert Z.get("/v1/expenses", headers=h).json()[0]["currency"] == "GBP"
