"""A stand-in for Zelt (HR and payroll): API-key access to the four lists the planner reads, with sample data."""
import hmac
import os

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse

from . import data

KEY = os.getenv("ZELT_DEMO_KEY", "demo-zelt-key")
app = FastAPI(title="zelt-surrogate", docs_url=None, redoc_url=None, openapi_url=None)


def denied(request: Request):
    given = request.headers.get("x-api-key", "")
    if not hmac.compare_digest(given.encode(), KEY.encode()):
        return JSONResponse({"error": "invalid api key"}, status_code=401)


@app.get("/v1/employees")
async def employees(request: Request):
    return denied(request) or data.zelt_employees()


@app.get("/v1/payroll/runs")
async def payroll(request: Request):
    return denied(request) or data.zelt_payroll()


@app.get("/v1/leave/requests")
async def leave(request: Request):
    return denied(request) or data.zelt_leave()


@app.get("/v1/expenses")
async def expenses(request: Request):
    return denied(request) or data.zelt_expenses()


@app.get("/")
async def home():
    return HTMLResponse(f"<h1>Demo Zelt</h1><p>A stand-in for Zelt with sample data. On the accounting page, connect with the API key "
                        f"<code>{KEY}</code>.</p>")


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
