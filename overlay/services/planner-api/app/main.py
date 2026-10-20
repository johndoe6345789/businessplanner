"""businessplanner-planner: the API behind LaunchPad's planning tools."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from . import auth, db
from .core import ApiError
from .routes_basic import router as basic
from .routes_businesses import router as businesses
from .routes_finance import router as finance
from .routes_integrations import router as integrations
from .routes_market import router as market
from .routes_progress import router as progress
from .routes_strategy import router as strategy

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("planner")


@asynccontextmanager
async def lifespan(app):
    await db.start()
    await auth.start()
    log.info("planner ready")
    yield
    await auth.stop()
    await db.stop()


app = FastAPI(title="businessplanner-planner", lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)
for r in (basic, businesses, strategy, market, finance, integrations, progress):
    app.include_router(r)


@app.get("/healthz")
async def healthz():
    await db.one("SELECT 1 AS ok")
    return {"status": "ok"}


@app.exception_handler(ApiError)
async def api_error(request: Request, e: ApiError):
    return JSONResponse({"error": e.message}, status_code=e.status)


@app.exception_handler(Exception)
async def unexpected(request: Request, e: Exception):
    log.exception("unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse({"error": "Internal server error"}, status_code=500)
