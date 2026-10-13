"""Financial tools, startup types, and the legal calculators."""
from fastapi import APIRouter, Request

from . import db, logic
from .core import ApiError, F, fail
from .http import User, body
from .resource import Singleton

router = APIRouter()
GBP = dict(kind="num", default=0, lo=0)

BURN = Singleton("burn_inputs", [F("monthly_burn_gbp", **GBP), F("cash_in_bank_gbp", **GBP), F("monthly_revenue_gbp", **GBP), F("notes", default="")])
UNIT = Singleton("unit_econ_inputs", [F("cac_gbp", **GBP), F("arpu_gbp", **GBP), F("churn_pct", kind="num", default=0, lo=0, hi=100),
                                      F("cogs_pct", kind="num", default=0, lo=0, hi=100)])
PRICING = Singleton("pricing_inputs", [
    F("revenue_model", choices=["subscription", "freemium", "usage", "transactional", "marketplace"], default="subscription"),
    F("price_gbp", **GBP), F("target_mrr_gbp", **GBP), F("initial_customers", kind="int", default=0, lo=0),
    F("monthly_growth_pct", kind="num", default=0, lo=-100, hi=1000), F("notes", default="")])
KILL = Singleton("kill_criteria", [F("runway_months_min", kind="int", default=3, lo=0), F("cac_ltv_ratio_min", kind="num", default=0.33, lo=0),
                                   F("weekly_active_users_min", kind="int", default=0, lo=0), F("custom_criteria", kind="json", default=[])])

for path, single in (("burn", BURN), ("unit-econ", UNIT), ("pricing", PRICING), ("kill-criteria", KILL)):
    def make(single):
        async def get(uid: str = User): return await single.read(uid)
        async def put(request: Request, uid: str = User): return await single.save(uid, await body(request))
        return get, put
    g, p = make(single)
    router.get(f"/api/financials/{path}")(g)
    router.put(f"/api/financials/{path}")(p)


@router.get("/api/startup-types")
async def startup_types(uid: str = User):
    rows = await db.rows("SELECT slug, name, description, icon, sort_order FROM startup_types ORDER BY sort_order")
    return {"types": [{"slug": r["slug"], "name": r["name"], "description": r["description"], "icon": r["icon"], "sortOrder": r["sort_order"]} for r in rows]}


@router.get("/api/startup-types/{slug}")
async def startup_type(slug: str, uid: str = User):
    t = await db.one("SELECT slug, name, description, icon, sort_order FROM startup_types WHERE slug = %s", slug)
    if not t:
        raise ApiError(404, "Startup type not found")
    stages = await db.rows("SELECT slug, name, description, display_order FROM startup_type_stages WHERE startup_type_slug = %s ORDER BY display_order", slug)
    traps = await db.rows("SELECT description FROM startup_type_traps WHERE startup_type_slug = %s ORDER BY sort_order", slug)
    return {"slug": t["slug"], "name": t["name"], "description": t["description"], "icon": t["icon"], "sortOrder": t["sort_order"],
            "stages": [{"slug": s["slug"], "name": s["name"], "description": s["description"], "displayOrder": s["display_order"]} for s in stages],
            "traps": [x["description"] for x in traps]}


@router.post("/api/legal/equity/split")
async def equity_split(request: Request, uid: str = User):
    data = await body(request)
    founders = data.get("founders") if isinstance(data, dict) else None
    if not isinstance(founders, list) or not founders or len(founders) > 20 or not all(isinstance(f, dict) for f in founders):
        fail("founders must be a non-empty list")
    try:
        return logic.equity_split(founders)
    except (ValueError, TypeError):
        fail("the founders' details could not be scored")


@router.post("/api/legal/equity/vesting")
async def equity_vesting(request: Request, uid: str = User):
    d = await body(request)
    if not isinstance(d, dict):
        fail("the request body must be a JSON object")
    try:
        return logic.vesting(int(d.get("totalShares", 0)), int(d.get("cliffMonths", 0)), int(d.get("vestingMonths", 0)), bool(d.get("accelerationOnChange", False)))
    except (ValueError, TypeError):
        fail("invalid vesting parameters")
