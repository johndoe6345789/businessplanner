"""Risks, decisions, feature scoping, pivots, accelerators, organisations, financial hypotheses."""
import datetime as dt

from fastapi import APIRouter

from . import db
from .core import ApiError, F, as_uuid
from .http import User, mount_crud
from .resource import Resource

router = APIRouter()

# ---- risk register ----
# risk_score is a generated column (probability x impact): the database computes it.
RISKS = Resource("risks", [
    F("category", choices=["market", "financial", "operational", "legal", "technical"], required=True),
    F("title", required=True, maxlen=300), F("description", default=""),
    F("probability", kind="int", required=True, lo=1, hi=5), F("impact", kind="int", required=True, lo=1, hi=5),
    F("mitigation_strategy", default=""), F("owner", default="", maxlen=200),
    F("status", choices=["open", "mitigating", "closed"], default="open"),
    F("organisation_id", kind="uuid", nullable=True),
], extra_cols=(("risk_score", "risk_score"),), order="risk_score DESC NULLS LAST, created_at DESC")
mount_crud(router, "/api/risk-assessment", RISKS)

# ---- decision log ----
DECISIONS = Resource("decisions", [
    F("title", required=True, maxlen=300), F("context", default=""), F("options_considered", default=""),
    F("decision", default=""), F("rationale", default=""), F("planner_step_id", default="", maxlen=200), F("outcome", default=""),
], ts=(("created_at", "created_at"), ("updated_at", "updated_at")))
# The decisions API has no user_id in its answers
DECISIONS.out_orig = DECISIONS.out
DECISIONS.out = lambda row: {k: v for k, v in DECISIONS.out_orig(row).items() if k != "user_id"}
mount_crud(router, "/api/decisions", DECISIONS, search=["title", "context", "options_considered", "decision", "rationale"])

# ---- feature scoping (ICE) ----
SCOPING = Resource("scoped_features", [
    F("title", required=True, maxlen=300), F("description", default=""),
    F("impact", kind="int", default=5, lo=1, hi=10), F("confidence", kind="int", default=5, lo=1, hi=10), F("ease", kind="int", default=5, lo=1, hi=10),
    F("status", choices=["in_mvp", "later", "cut", "considering"], default="considering"),
], post=lambda row, d: {**d, "ice_score": row["impact"] * row["confidence"] * row["ease"]},
    order="(impact * confidence * ease) DESC, created_at DESC")
mount_crud(router, "/api/scoping/features", SCOPING)

# ---- pivots ----
def _pivot_pre(vals, data):
    vals["pivoted_at"] = vals["pivoted_at"] or dt.date.today()
    return vals

PIVOTS = Resource("pivots", [
    F("original_idea", required=True), F("new_direction", required=True), F("trigger_event", default=""),
    F("rationale", default=""), F("plan_impact", default=""), F("pivoted_at", kind="date", nullable=True),
], ts=(("created_at", "created_at"),), touch=False, pre=_pivot_pre, order="pivoted_at DESC, created_at DESC")
mount_crud(router, "/api/pivots", PIVOTS)

# ---- accelerators and funding programmes ----
ACCEL = Resource("accelerator_programmes", [
    F("name", required=True, maxlen=300),
    F("programme_type", choices=["accelerator", "competition", "grant", "fellowship"], default="accelerator"),
    F("website", default=""), F("deadline", kind="date", nullable=True),
    F("status", choices=["researching", "applying", "applied", "interviewing", "accepted", "rejected", "passed"], default="researching"),
    F("notes", default=""), F("equity_pct", kind="num", nullable=True, lo=0, hi=100), F("funding_gbp", kind="num", nullable=True, lo=0),
    F("organisation_id", kind="uuid", nullable=True),
], order="deadline NULLS LAST, created_at DESC")
mount_crud(router, "/api/accelerators", ACCEL)

# ---- organisations ----
ORGS = Resource("organisations", [
    F("name", required=True, maxlen=300), F("website", default=""), F("description", default=""),
    F("entity_types", kind="textarr", default=[]), F("tags", kind="textarr", default=[]), F("notes", default=""),
    F("initial_investment_gbp", kind="int", default=0, lo=0), F("weeks_to_bootstrap", kind="int", default=0, lo=0),
    F("monthly_revenue_gbp", kind="int", default=0, lo=0), F("parent_org_id", kind="uuid", nullable=True),
], order="name")
mount_crud(router, "/api/organisations", ORGS, search=["name", "description", "notes"])


@router.get("/api/organisations/{rid}/steps")
async def org_steps(rid: str, uid: str = User):
    org = await ORGS.get(uid, rid)
    rows = await db.rows("SELECT * FROM startup_steps WHERE organisation_id = %s ORDER BY step_number", as_uuid(org["id"]))
    return [{"id": str(r["id"]), "organisation_id": str(r["organisation_id"]), "step_number": r["step_number"],
             "title": r["title"], "description": r["description"], "created_at": r["created_at"].isoformat()} for r in rows]


@router.get("/api/organisations/{rid}")
async def org_one(rid: str, uid: str = User):
    return await ORGS.get(uid, rid)

# ---- financial hypotheses ----
HYPOTHESES = Resource("financial_hypotheses", [
    F("assumption", required=True), F("test_method", default=""), F("result", default=""),
    F("status", choices=["untested", "validated", "invalidated"], default="untested"),
])
HYPOTHESES.out_orig = HYPOTHESES.out
HYPOTHESES.out = lambda row: {k: v for k, v in HYPOTHESES.out_orig(row).items() if k != "user_id"}
mount_crud(router, "/api/financials/hypotheses", HYPOTHESES)
