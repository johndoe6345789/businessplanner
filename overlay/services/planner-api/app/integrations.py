"""Clients for Xero (accounting, OAuth2) and Zelt (payroll, API key).

Every address is configuration, so the same code talks to the real services or to the stand-in apps in
`services/surrogates` (sample data, no account needed). Nothing here is Xero- or Zelt-specific beyond the paths."""
import base64
import hashlib
import hmac
import json
import os
import time
from urllib.parse import urlparse

import httpx

from . import db
from .core import ApiError


def cfg(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def xero_configured() -> bool:
    return bool(cfg("XERO_CLIENT_ID") and cfg("XERO_CLIENT_SECRET") and cfg("INTEGRATION_STATE_SECRET"))


def demo_mode(name: str) -> bool:
    """True when the configured provider is a stand-in with sample data, not the real service."""
    return cfg(f"{name.upper()}_DEMO") == "1"


# ---- signed OAuth state: carries who is connecting through the provider and back, and cannot be forged ----
def sign_state(owner: str, now: float | None = None, ttl: int = 600) -> str:
    payload = base64.urlsafe_b64encode(json.dumps({"o": owner, "x": int((now or time.time()) + ttl)}).encode()).decode().rstrip("=")
    sig = hmac.new(cfg("INTEGRATION_STATE_SECRET").encode(), payload.encode(), hashlib.sha256).hexdigest()[:32]
    return f"{payload}.{sig}"


def read_state(state: str, now: float | None = None) -> str:
    try:
        payload, sig = state.rsplit(".", 1)
        good = hmac.new(cfg("INTEGRATION_STATE_SECRET").encode(), payload.encode(), hashlib.sha256).hexdigest()[:32]
        data = json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
        if hmac.compare_digest(sig, good) and data["x"] >= (now or time.time()):
            return data["o"]
    except (ValueError, KeyError, TypeError):
        pass
    raise ApiError(400, "This sign-in link is not valid or has expired. Start again from the accounting page.")


# ---- Xero ----
def xero_authorize_url(owner: str) -> str:
    from urllib.parse import urlencode
    q = urlencode({"response_type": "code", "client_id": cfg("XERO_CLIENT_ID"), "redirect_uri": cfg("XERO_REDIRECT_URI"),
                   "scope": "openid profile email accounting.transactions accounting.reports.read offline_access", "state": sign_state(owner)})
    return cfg("XERO_AUTHORIZE_URL", "https://login.xero.com/identity/connect/authorize") + "?" + q


async def _token_call(client: httpx.AsyncClient, form: dict) -> dict:
    r = await client.post(cfg("XERO_TOKEN_URL", "https://identity.xero.com/connect/token"), data=form,
                          auth=(cfg("XERO_CLIENT_ID"), cfg("XERO_CLIENT_SECRET")), headers={"Accept": "application/json"})
    if r.status_code != 200:
        raise ApiError(502, "Xero did not accept the sign-in. Please try connecting again.")
    return r.json()


async def xero_finish_connect(client: httpx.AsyncClient, owner: str, code: str):
    tokens = await _token_call(client, {"grant_type": "authorization_code", "code": code, "redirect_uri": cfg("XERO_REDIRECT_URI")})
    r = await client.get(cfg("XERO_CONNECTIONS_URL", "https://api.xero.com/connections"),
                         headers={"Authorization": "Bearer " + tokens["access_token"], "Accept": "application/json"})
    orgs = r.json() if r.status_code == 200 else []
    if not orgs:
        raise ApiError(502, "No Xero organisation was shared with this app.")
    await save_tokens(owner, orgs[0]["tenantId"], orgs[0].get("tenantName") or "Xero organisation", tokens)


async def save_tokens(owner: str, tenant_id: str, tenant_name: str, tokens: dict):
    expires = int(tokens.get("expires_in", 1800))
    await db.run(
        "INSERT INTO xero_connections (user_id, tenant_id, tenant_name, access_token, refresh_token, expires_at) "
        "VALUES (%s, %s, %s, %s, %s, now() + make_interval(secs => %s)) "
        "ON CONFLICT (user_id) DO UPDATE SET tenant_id = EXCLUDED.tenant_id, tenant_name = EXCLUDED.tenant_name, "
        "access_token = EXCLUDED.access_token, refresh_token = EXCLUDED.refresh_token, expires_at = EXCLUDED.expires_at, updated_at = now()",
        owner, tenant_id, tenant_name, tokens["access_token"], tokens["refresh_token"], expires)


async def xero_connection(owner: str):
    return await db.one("SELECT *, expires_at <= now() + interval '60 seconds' AS stale FROM xero_connections WHERE user_id = %s", owner)


async def xero_get(client: httpx.AsyncClient, owner: str, path: str) -> dict:
    conn = await xero_connection(owner)
    if not conn:
        raise ApiError(409, "Not connected to Xero.")
    if conn["stale"]:
        tokens = await _token_call(client, {"grant_type": "refresh_token", "refresh_token": conn["refresh_token"]})
        await save_tokens(owner, conn["tenant_id"], conn["tenant_name"], tokens)
        conn = await xero_connection(owner)
    r = await client.get(cfg("XERO_API_URL", "https://api.xero.com") + path,
                         headers={"Authorization": "Bearer " + conn["access_token"], "xero-tenant-id": conn["tenant_id"], "Accept": "application/json"})
    if r.status_code in (401, 403):
        await db.run("DELETE FROM xero_connections WHERE user_id = %s", owner)      # access was revoked on Xero's side
        raise ApiError(409, "Xero access was withdrawn. Connect again.")
    if r.status_code != 200:
        raise ApiError(502, "Xero is not answering right now.")
    return r.json()


def flatten_report(xero: dict) -> dict:
    """Xero nests report rows in sections with capitalised keys; the app's reports are flat lists, lower-case."""
    def rows(rs):
        for row in rs or []:
            kind = row.get("RowType", "")
            yield {"rowType": kind, "title": row.get("Title", ""), "cells": [{"value": str(c.get("Value", ""))} for c in row.get("Cells", [])]}
            yield from rows(row.get("Rows"))
    return {"Reports": [{"ReportID": rep.get("ReportID", ""), "ReportName": rep.get("ReportName", ""), "Rows": list(rows(rep.get("Rows")))}
                        for rep in xero.get("Reports", [])]}


# ---- Zelt ----
def zelt_bases() -> list[str]:
    return [b.strip().rstrip("/") for b in cfg("ZELT_ALLOWED_BASES", "https://api.zelt.app").split(",") if b.strip()]


def zelt_base(requested: str | None) -> str:
    """The Zelt address to use. People may name one, but only from the configured list: this service must never
    be a way to make requests to arbitrary (for instance internal) addresses."""
    base = (requested or cfg("ZELT_DEFAULT_BASE_URL") or zelt_bases()[0]).strip().rstrip("/")
    allowed = {b: urlparse(b) for b in zelt_bases()}
    if base not in allowed:
        raise ApiError(400, "That Zelt address is not allowed.")
    return base


async def zelt_get(client: httpx.AsyncClient, base: str, key: str, path: str):
    r = await client.get(base + path, headers={"X-API-Key": key, "Accept": "application/json"})
    if r.status_code in (401, 403):
        raise ApiError(401, "Zelt did not accept that API key.")
    if r.status_code != 200:
        raise ApiError(502, "Zelt is not answering right now.")
    data = r.json()
    return data.get("data", data) if isinstance(data, dict) else data
