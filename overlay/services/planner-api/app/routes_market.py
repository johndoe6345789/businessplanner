"""Market research: market size, business model canvas, competitors, personas, customer discovery."""
import datetime as dt

from fastapi import APIRouter, Request

from .core import F
from .http import User, body, mount_crud
from .resource import Resource, Singleton

router = APIRouter()

TAM = Singleton("tam_inputs", [
    F("totalMarketUsd", "total_market_usd", "num", default=0, lo=0), F("targetSegmentPct", "target_segment_pct", "num", default=0, lo=0, hi=100),
    F("reachablePct", "reachable_pct", "num", default=0, lo=0, hi=100), F("notes", default=""),
])
BMC = Singleton("bmc_canvas", [
    F("problem", default=""), F("solution", default=""), F("uvp", default=""), F("channels", default=""),
    F("customerSegments", "customer_segments", default=""), F("costStructure", "cost_structure", default=""),
    F("revenueStreams", "revenue_streams", default=""), F("keyMetrics", "key_metrics", default=""), F("unfairAdvantage", "unfair_advantage", default=""),
])

@router.get("/api/market-research/tam")
async def tam_get(uid: str = User): return await TAM.read(uid)

@router.put("/api/market-research/tam")
async def tam_put(request: Request, uid: str = User): return await TAM.save(uid, await body(request))

@router.get("/api/market-research/bmc")
async def bmc_get(uid: str = User): return await BMC.read(uid)

@router.put("/api/market-research/bmc")
async def bmc_put(request: Request, uid: str = User): return await BMC.save(uid, await body(request))

COMPETITORS = Resource("competitors", [
    F("name", required=True, maxlen=300), F("website", default=""), F("stage", default="", maxlen=200),
    F("strengths", kind="textarr", default=[]), F("weaknesses", kind="textarr", default=[]),
    F("features", kind="json", default={}), F("notes", default=""), F("organisation_id", kind="uuid", nullable=True),
], user_key="userId", ts=(), order="created_at DESC")
mount_crud(router, "/api/market-research/competitors", COMPETITORS)

PERSONAS = Resource("personas", [
    F("name", required=True, maxlen=300), F("role", default="", maxlen=300),
    F("painPoints", "pain_points", "textarr", default=[]), F("goals", kind="textarr", default=[]), F("notes", default=""),
], user_key="userId", ts=())
mount_crud(router, "/api/market-research/personas", PERSONAS)


def _discovery_pre(vals, data):
    vals["interview_date"] = vals["interview_date"] or dt.date.today()
    return vals

DISCOVERY = Resource("discovery_entries", [
    F("contactName", "contact_name", required=True, maxlen=300), F("date", "interview_date", "date", nullable=True),
    F("keyFindings", "key_findings", default=""), F("validatedAssumptions", "validated_assumptions", "textarr", default=[]),
    F("invalidatedAssumptions", "invalidated_assumptions", "textarr", default=[]),
], user_key="userId", ts=(), touch=False, pre=_discovery_pre, order="interview_date DESC, created_at DESC")
mount_crud(router, "/api/market-research/discovery", DISCOVERY)
