"""Xero (accounting) and Zelt (payroll). Real clients, configured by environment: point them at the real services
or at the stand-in apps in services/surrogates. Without configuration they say so instead of failing oddly."""
import httpx
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

from . import db, integrations as ig
from .core import ApiError
from .http import User, body

router = APIRouter()
ACCOUNTING_PAGE = "/app/en/accounting"
XERO_DATA = {"invoices": "/api.xro/2.0/Invoices", "transactions": "/api.xro/2.0/BankTransactions"}
XERO_REPORTS = {"profit-loss": "ProfitAndLoss", "balance-sheet": "BalanceSheet", "cash-flow": "ExecutiveSummary"}
ZELT_DATA = {"payroll": "/v1/payroll/runs", "employees": "/v1/employees", "leave": "/v1/leave/requests", "expenses": "/v1/expenses"}


def http() -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=15, follow_redirects=False)


# ---------------- Xero ----------------
@router.get("/api/xero/status")
async def xero_status(uid: str = User):
    conn = await ig.xero_connection(uid)
    out = {"connected": bool(conn), "available": ig.xero_configured(), "demo": ig.demo_mode("xero")}
    if conn:
        out["tenantName"] = conn["tenant_name"]
    return out


@router.post("/api/xero/connect")
async def xero_connect(uid: str = User):
    if not ig.xero_configured():
        raise ApiError(503, "Xero is not set up on this server.")
    return {"url": ig.xero_authorize_url(uid)}


@router.get("/api/xero/callback")
async def xero_callback(request: Request):
    """The browser comes back from Xero here, with no Authorization header: the signed state says who it is."""
    if not ig.xero_configured():
        raise ApiError(503, "Xero is not set up on this server.")
    owner = ig.read_state(request.query_params.get("state", ""))
    code = request.query_params.get("code", "")
    if not code:
        return RedirectResponse(ACCOUNTING_PAGE + "?xero=denied")
    async with http() as client:
        await ig.xero_finish_connect(client, owner, code)
    return RedirectResponse(ACCOUNTING_PAGE + "?xero=connected")


@router.delete("/api/xero/disconnect")
async def xero_disconnect(uid: str = User):
    await db.run("DELETE FROM xero_connections WHERE user_id = %s", uid)
    return {}


def _xero_data(name, path):
    @router.get(f"/api/xero/{name}")
    async def data(uid: str = User):
        async with http() as client:
            return await ig.xero_get(client, uid, path)
    return data


for _n, _p in XERO_DATA.items():
    _xero_data(_n, _p)


def _xero_report(name, report):
    @router.get(f"/api/xero/reports/{name}")
    async def data(uid: str = User):
        async with http() as client:
            return ig.flatten_report(await ig.xero_get(client, uid, f"/api.xro/2.0/Reports/{report}"))
    return data


for _n, _r in XERO_REPORTS.items():
    _xero_report(_n, _r)


# ---------------- Zelt ----------------
@router.get("/api/zelt/status")
async def zelt_status(uid: str = User):
    row = await db.one("SELECT 1 AS x FROM zelt_connections WHERE user_id = %s", uid)
    out = {"connected": bool(row), "demo": ig.demo_mode("zelt")}
    if out["demo"]:
        out["demoKey"] = ig.cfg("ZELT_DEMO_KEY", "demo-zelt-key")
    return out


@router.post("/api/zelt/connect")
async def zelt_connect(request: Request, uid: str = User):
    data = await body(request)
    key = str((data or {}).get("api_key") or "").strip() if isinstance(data, dict) else ""
    if not key or len(key) > 300:
        raise ApiError(400, "api_key is required")
    base = ig.zelt_base((data or {}).get("base_url") or None)
    async with http() as client:
        await ig.zelt_get(client, base, key, ZELT_DATA["employees"])          # a key that does not work is not saved
    await db.run("INSERT INTO zelt_connections (user_id, api_key, base_url) VALUES (%s, %s, %s) "
                 "ON CONFLICT (user_id) DO UPDATE SET api_key = EXCLUDED.api_key, base_url = EXCLUDED.base_url, updated_at = now()", uid, key, base)
    return {}


@router.delete("/api/zelt/disconnect")
async def zelt_disconnect(uid: str = User):
    await db.run("DELETE FROM zelt_connections WHERE user_id = %s", uid)
    return {}


def _zelt_data(name, path):
    @router.get(f"/api/zelt/{name}")
    async def data(uid: str = User):
        row = await db.one("SELECT api_key, base_url FROM zelt_connections WHERE user_id = %s", uid)
        if not row:
            raise ApiError(409, "Not connected to Zelt.")
        async with http() as client:
            return await ig.zelt_get(client, ig.zelt_base(row["base_url"]), row["api_key"], path)
    return data


for _n, _p in ZELT_DATA.items():
    _zelt_data(_n, _p)
