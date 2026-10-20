"""A stand-in for Xero: the OAuth2 sign-in/consent pages, token endpoint, connections list and the accounting API
calls the planner makes, with sample data. It is NOT Xero: every page says so. Tokens are signed, not stored, so a
restart does not disconnect anyone."""
import base64
import hashlib
import hmac
import html
import json
import os
import secrets
import time
from urllib.parse import urlencode

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse

from . import data

SECRET = os.getenv("SURROGATE_SECRET") or secrets.token_hex(16)
CLIENT_ID = os.getenv("XERO_CLIENT_ID", "demo-xero-client")
CLIENT_SECRET = os.getenv("XERO_CLIENT_SECRET", "demo-xero-secret")
REDIRECTS = [u for u in os.getenv("XERO_REDIRECT_URI", "https://business.wardcrew.com/api/xero/callback").split(",") if u]
TENANT = {"tenantId": "5a1d2c3e-0000-4000-8000-00000000d3a0", "tenantName": "Demo Company (UK)", "tenantType": "ORGANISATION"}
app = FastAPI(title="xero-surrogate", docs_url=None, redoc_url=None, openapi_url=None)


def sign(kind: str, ttl: int, **extra) -> str:
    payload = base64.urlsafe_b64encode(json.dumps({"k": kind, "x": int(time.time()) + ttl, "n": secrets.token_hex(4), **extra}).encode()).decode().rstrip("=")
    return payload + "." + hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()[:32]


def read(token: str, kind: str) -> dict | None:
    try:
        payload, sig = token.rsplit(".", 1)
        if not hmac.compare_digest(sig, hmac.new(SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()[:32]):
            return None
        d = json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
        return d if d["k"] == kind and d["x"] >= time.time() else None
    except (ValueError, KeyError, TypeError):
        return None


PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Demo Xero: allow access</title><style>
:root{color-scheme:light dark}body{font:16px/1.5 system-ui,sans-serif;margin:0;display:grid;place-items:center;min-height:100vh;background:#f2f5f9;color:#14212b}
@media(prefers-color-scheme:dark){body{background:#12171c;color:#e8eef3}.card{background:#1b232b;border-color:#2c3943}}
.card{max-width:30rem;margin:1rem;padding:1.5rem 1.75rem;border:1px solid #d5dde5;border-radius:12px;background:#fff}
.banner{background:#fff4cc;color:#4d3b00;border-radius:8px;padding:.6rem .8rem;font-size:.9rem;margin-bottom:1rem}
h1{font-size:1.25rem;margin:.2rem 0 1rem}ul{padding-left:1.2rem}.row{display:flex;gap:.6rem;margin-top:1.2rem}
button{font:inherit;padding:.6rem 1.1rem;border-radius:8px;border:1px solid #13b5ea;cursor:pointer}.go{background:#13b5ea;color:#fff;font-weight:600}.no{background:transparent;color:inherit}
</style></head><body><main class="card"><div class="banner"><strong>This is a demo, not Xero.</strong> It is a stand-in service with made-up sample data, so you can try the accounting pages without a Xero account.</div>
<h1>Allow BusinessPlanner to access <em>Demo Company (UK)</em>?</h1>
<p>BusinessPlanner will be able to:</p><ul><li>read invoices and bank transactions</li><li>read profit and loss, balance sheet and summary reports</li></ul>
<form method="post" action="decision">__HIDDEN__<div class="row"><button class="go" name="decision" value="allow">Allow access</button><button class="no" name="decision" value="deny">Cancel</button></div></form>
</main></body></html>"""


def checked(client_id: str, redirect_uri: str):
    return client_id == CLIENT_ID and redirect_uri in REDIRECTS


@app.get("/identity/connect/authorize")
async def authorize(request: Request):
    q = request.query_params
    if not checked(q.get("client_id", ""), q.get("redirect_uri", "")) or q.get("response_type") != "code":
        return HTMLResponse("<h1>Invalid request</h1><p>Unknown application or return address.</p>", status_code=400)
    hidden = "".join(f'<input type="hidden" name="{k}" value="{html.escape(q.get(k, ""))}">' for k in ("client_id", "redirect_uri", "state"))
    return HTMLResponse(PAGE.replace("__HIDDEN__", hidden), headers={"Cache-Control": "no-store", "X-Frame-Options": "DENY"})


@app.post("/identity/connect/decision")
async def decision(client_id: str = Form(""), redirect_uri: str = Form(""), state: str = Form(""), decision: str = Form("deny")):
    if not checked(client_id, redirect_uri):
        return HTMLResponse("<h1>Invalid request</h1>", status_code=400)
    q = {"state": state}
    if decision == "allow":
        q["code"] = sign("code", 300, redirect_uri=redirect_uri)
    else:
        q["error"] = "access_denied"
    return RedirectResponse(redirect_uri + ("&" if "?" in redirect_uri else "?") + urlencode(q), status_code=303)


def client_ok(request: Request) -> bool:
    h = request.headers.get("authorization", "")
    try:
        user, _, pw = base64.b64decode(h.split(" ", 1)[1]).decode().partition(":")
    except Exception:
        return False
    return hmac.compare_digest(user, CLIENT_ID) and hmac.compare_digest(pw, CLIENT_SECRET)


@app.post("/identity/connect/token")
async def token(request: Request):
    if not client_ok(request):
        return JSONResponse({"error": "invalid_client"}, status_code=401)
    form = await request.form()
    grant = form.get("grant_type")
    if grant == "authorization_code":
        c = read(str(form.get("code", "")), "code")
        if not c or c.get("redirect_uri") != form.get("redirect_uri"):
            return JSONResponse({"error": "invalid_grant"}, status_code=400)
    elif grant == "refresh_token":
        if not read(str(form.get("refresh_token", "")), "refresh"):
            return JSONResponse({"error": "invalid_grant"}, status_code=400)
    else:
        return JSONResponse({"error": "unsupported_grant_type"}, status_code=400)
    return {"access_token": sign("access", 1800), "refresh_token": sign("refresh", 60 * 24 * 3600), "expires_in": 1800, "token_type": "Bearer",
            "scope": "accounting.transactions accounting.reports.read offline_access"}


def bearer(request: Request) -> bool:
    h = request.headers.get("authorization", "")
    return h.lower().startswith("bearer ") and read(h[7:].strip(), "access") is not None


@app.get("/connections")
async def connections(request: Request):
    if not bearer(request):
        return JSONResponse({"Title": "Unauthorized"}, status_code=401)
    return [TENANT]


def guarded(request: Request):
    if not bearer(request):
        return JSONResponse({"Title": "Unauthorized"}, status_code=401)
    if request.headers.get("xero-tenant-id") != TENANT["tenantId"]:
        return JSONResponse({"Title": "Forbidden", "Detail": "AuthenticationUnsuccessful"}, status_code=403)


@app.get("/api.xro/2.0/Invoices")
async def invoices(request: Request):
    return guarded(request) or {"Invoices": data.invoices()}


@app.get("/api.xro/2.0/BankTransactions")
async def bank(request: Request):
    return guarded(request) or {"BankTransactions": data.bank_transactions()}


@app.get("/api.xro/2.0/Reports/{name}")
async def reports(name: str, request: Request):
    if name not in ("ProfitAndLoss", "BalanceSheet", "ExecutiveSummary"):
        return JSONResponse({"Title": "Not Found"}, status_code=404)
    return guarded(request) or data.report(name)


@app.get("/")
async def home():
    return HTMLResponse("<h1>Demo Xero</h1><p>A stand-in for Xero with sample data. Connect it from the accounting page.</p>")


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
