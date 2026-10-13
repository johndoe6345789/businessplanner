"""KPIs, OKRs, PDCA cycles, Hoshin Kanri, bowling charts and the weekly review."""
import datetime as dt
import json

from fastapi import APIRouter, Request

from . import db, logic
from .core import ApiError, F, as_uuid, conv, fail, parse_fields
from .http import User, body, mount_crud
from .resource import Resource

router = APIRouter()

# ---------------------------------------------------------------- KPIs
def _kpi_pre(vals, data):
    vals["status"] = logic.kpi_status(vals["baseline"], vals["current_val"], vals["target_val"])
    return vals

KPIS = Resource("kpi_metrics", [
    F("title", "name", required=True, maxlen=300),
    F("category", choices=["financial", "customer", "operational", "growth", "strategic"], required=True),
    F("current_value", "current_val", "num", default=0.0), F("target_value", "target_val", "num", default=0.0),
    F("baseline_value", "baseline", "num", default=0.0), F("unit", default="", maxlen=50),
    F("period_start", kind="date", nullable=True), F("period_end", kind="date", nullable=True),
], pre=_kpi_pre, extra_cols=(("status", "status"),))
mount_crud(router, "/api/kpi/metrics", KPIS)


async def _kpi_value(rid: str, request: Request, uid: str):
    data = await body(request)
    cur = F("current_value", "current_val", "num", required=True).parse(data if isinstance(data, dict) else {})
    old = await db.one("SELECT * FROM kpi_metrics WHERE id = %s AND user_id = %s", as_uuid(rid), uid)
    if not old:
        raise ApiError(404, "not found")
    status = logic.kpi_status(float(old["baseline"]), cur, float(old["target_val"]))
    row = await db.one("UPDATE kpi_metrics SET current_val = %s, status = %s, trend = %s, last_updated = now(), updated_at = now() "
                       "WHERE id = %s AND user_id = %s RETURNING *", cur, status, logic.kpi_trend(float(old["current_val"]), cur), old["id"], uid)
    return KPIS.out(row)

@router.put("/api/kpi/metrics/{rid}/value")
async def kpi_value_put(rid: str, request: Request, uid: str = User):
    return await _kpi_value(rid, request, uid)

@router.patch("/api/kpi/metrics/{rid}/value")
async def kpi_value_patch(rid: str, request: Request, uid: str = User):
    return await _kpi_value(rid, request, uid)

# ---------------------------------------------------------------- OKRs
def kr_out(r, uid) -> dict:
    return {"id": str(r["id"]), "objective_id": str(r["objective_id"]), "user_id": uid, "title": r["description"],
            "start_value": conv(r["start_value"]), "current_value": conv(r["current_value"]), "target_value": conv(r["target_value"]),
            "unit": r["unit"], "progress": conv(r["progress"]), "status": r["status"]}


def objective_out(o, krs) -> dict:
    return {"id": str(o["id"]), "user_id": str(o["user_id"]), "title": o["title"], "description": o["description"],
            "quarter": logic.quarter_number(o["quarter"]), "year": int(o["year"]), "status": o["status"],
            "key_results": [kr_out(k, str(o["user_id"])) for k in krs]}

OBJ_FIELDS = [F("title", required=True, maxlen=300), F("description", default=""),
              F("quarter", kind="int", required=True, lo=1, hi=4), F("year", kind="int", required=True, lo=2000, hi=2100),
              F("status", choices=["active", "completed", "cancelled"], default="active")]

@router.get("/api/okr/objectives")
async def okr_list(request: Request, uid: str = User):
    where, args = "", []
    q = request.query_params.get("quarter")
    if q:
        if not q.isdigit() or not 1 <= int(q) <= 4:
            fail("quarter must be 1 to 4")
        where += " AND quarter = %s"; args.append(logic.quarter_label(int(q)))
    y = request.query_params.get("year")
    if y:
        if not y.isdigit():
            fail("year must be a number")
        where += " AND year = %s"; args.append(int(y))
    objs = await db.rows(f"SELECT * FROM okr_objectives WHERE user_id = %s {where} ORDER BY created_at DESC", uid, *args)
    krs = await db.rows("SELECT k.* FROM okr_key_results k JOIN okr_objectives o ON o.id = k.objective_id WHERE o.user_id = %s ORDER BY k.created_at", uid) if objs else []
    return [objective_out(o, [k for k in krs if k["objective_id"] == o["id"]]) for o in objs]

@router.post("/api/okr/objectives", status_code=201)
async def okr_create(request: Request, uid: str = User):
    v = parse_fields(OBJ_FIELDS, await body(request))
    try:
        row = await db.one("INSERT INTO okr_objectives (user_id, title, description, quarter, year, status) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                           uid, v["title"], v["description"], logic.quarter_label(v["quarter"]), v["year"], v["status"])
    except Exception as e:
        raise db.db_error(e)
    return objective_out(row, [])

@router.delete("/api/okr/objectives/{rid}")
async def okr_delete(rid: str, uid: str = User):
    rid = as_uuid(rid)
    async with db.pool.connection() as c:
        async with c.transaction():
            cur = await c.execute("DELETE FROM okr_objectives WHERE id = %s AND user_id = %s RETURNING id", (rid, uid))
            if not await cur.fetchall():
                raise ApiError(404, "not found")
            await c.execute("DELETE FROM okr_key_results WHERE objective_id = %s", (rid,))
    return {}

KR_FIELDS = [F("title", "description", required=True, maxlen=500), F("start_value", kind="num", default=0.0),
             F("target_value", kind="num", required=True), F("unit", default="", maxlen=50)]

@router.post("/api/okr/objectives/{rid}/key-results", status_code=201)
async def kr_add(rid: str, request: Request, uid: str = User):
    v = parse_fields(KR_FIELDS, await body(request))
    obj = await db.one("SELECT id FROM okr_objectives WHERE id = %s AND user_id = %s", as_uuid(rid), uid)
    if not obj:
        raise ApiError(404, "objective not found")
    progress, status = logic.kr_progress(v["start_value"], v["start_value"], v["target_value"])
    row = await db.one("INSERT INTO okr_key_results (objective_id, description, start_value, current_value, target_value, unit, progress, status) "
                       "VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *", obj["id"], v["description"], v["start_value"], v["start_value"],
                       v["target_value"], v["unit"], progress, status)
    return kr_out(row, uid)

@router.put("/api/okr/key-results/{rid}/value")
async def kr_value(rid: str, request: Request, uid: str = User):
    data = await body(request)
    cur = F("current_value", kind="num", required=True).parse(data if isinstance(data, dict) else {})
    old = await db.one("SELECT k.* FROM okr_key_results k JOIN okr_objectives o ON o.id = k.objective_id WHERE k.id = %s AND o.user_id = %s", as_uuid(rid), uid)
    if not old:
        raise ApiError(404, "not found")
    progress, status = logic.kr_progress(float(old["start_value"]), cur, float(old["target_value"]))
    row = await db.one("UPDATE okr_key_results SET current_value = %s, progress = %s, status = %s, last_updated = now() WHERE id = %s RETURNING *",
                       cur, progress, status, old["id"])
    return kr_out(row, uid)

@router.delete("/api/okr/key-results/{rid}")
async def kr_delete(rid: str, uid: str = User):
    n = await db.run("DELETE FROM okr_key_results k USING okr_objectives o WHERE k.id = %s AND k.objective_id = o.id AND o.user_id = %s", as_uuid(rid), uid)
    if not n:
        raise ApiError(404, "not found")
    return {}

# ---------------------------------------------------------------- PDCA
def pdca_out(r) -> dict:
    return {"id": str(r["id"]), "user_id": str(r["user_id"]), "title": r["title"], "description": r["description"],
            "current_phase": r["current_phase"], "status": r["status"],
            **{f"{p}_phase": logic.normalise_phase(r[f"{p}_phase"]) for p in logic.PHASES},
            "created_at": conv(r["created_at"]), "updated_at": conv(r["updated_at"])}

@router.get("/api/pdca/cycles")
async def pdca_list(uid: str = User):
    return [pdca_out(r) for r in await db.rows("SELECT * FROM pdca_cycles WHERE user_id = %s ORDER BY created_at DESC", uid)]

@router.post("/api/pdca/cycles", status_code=201)
async def pdca_create(request: Request, uid: str = User):
    v = parse_fields([F("title", required=True, maxlen=300), F("description", default="")], await body(request))
    from psycopg.types.json import Jsonb
    ph = Jsonb(logic.empty_phase())
    row = await db.one("INSERT INTO pdca_cycles (user_id, title, description, current_phase, status, plan_phase, do_phase, check_phase, act_phase) "
                       "VALUES (%s,%s,%s,'plan','in-progress',%s,%s,%s,%s) RETURNING *", uid, v["title"], v["description"], ph, ph, ph, ph)
    return pdca_out(row)

@router.put("/api/pdca/cycles/{rid}/phase")
async def pdca_phase(rid: str, request: Request, uid: str = User):
    data = await body(request)
    v = parse_fields([F("phase", choices=logic.PHASES, required=True), F("notes", default="")], data)
    if not isinstance(data.get("completed"), bool):
        fail("completed must be true or false")
    completed = data["completed"]
    cyc = await db.one("SELECT * FROM pdca_cycles WHERE id = %s AND user_id = %s", as_uuid(rid), uid)
    if not cyc:
        raise ApiError(404, "not found")
    from psycopg.types.json import Jsonb
    phase = {"notes": v["notes"], "completed": completed, "completed_at": dt.datetime.now(dt.timezone.utc).isoformat() if completed else None}
    current, status = logic.advance(cyc["current_phase"], v["phase"], completed)
    row = await db.one(f"UPDATE pdca_cycles SET {v['phase']}_phase = %s, current_phase = %s, status = %s, updated_at = now() WHERE id = %s RETURNING *",
                       Jsonb(phase), current, status, cyc["id"])
    return pdca_out(row)

@router.delete("/api/pdca/cycles/{rid}")
async def pdca_delete(rid: str, uid: str = User):
    if not await db.run("DELETE FROM pdca_cycles WHERE id = %s AND user_id = %s", as_uuid(rid), uid):
        raise ApiError(404, "not found")
    return {}

# ---------------------------------------------------------------- Hoshin Kanri
HOSHIN = Resource("hoshin_objectives", [
    F("title", required=True, maxlen=300), F("description", default=""),
    F("horizon", choices=["vision", "breakthrough", "annual"], default="annual"),
    F("target_date", kind="date", nullable=True), F("sort_order", kind="int", default=0),
], order="sort_order, created_at")
mount_crud(router, "/api/hoshin/objectives", HOSHIN, update=False)

LINK_FIELDS = [F("objective_id", kind="uuid", required=True), F("organisation_id", kind="uuid", required=True),
               F("strength", choices=["strong", "medium", "weak"], default="strong")]

def link_out(r): return {"id": str(r["id"]), "objective_id": str(r["objective_id"]), "organisation_id": str(r["organisation_id"]), "strength": r["strength"]}

@router.get("/api/hoshin/links")
async def links_list(uid: str = User):
    rows = await db.rows("SELECT l.* FROM hoshin_links l JOIN hoshin_objectives o ON o.id = l.objective_id WHERE o.user_id = %s", uid)
    return [link_out(r) for r in rows]

@router.post("/api/hoshin/links", status_code=201)
async def links_create(request: Request, uid: str = User):
    v = parse_fields(LINK_FIELDS, await body(request))
    if not await db.one("SELECT 1 AS x FROM hoshin_objectives WHERE id = %s AND user_id = %s", v["objective_id"], uid):
        raise ApiError(404, "objective not found")
    if not await db.one("SELECT 1 AS x FROM organisations WHERE id = %s AND user_id = %s", v["organisation_id"], uid):
        raise ApiError(404, "organisation not found")
    try:
        row = await db.one("INSERT INTO hoshin_links (objective_id, organisation_id, strength) VALUES (%s,%s,%s) RETURNING *",
                           v["objective_id"], v["organisation_id"], v["strength"])
    except Exception as e:
        raise db.db_error(e)
    return link_out(row)

@router.delete("/api/hoshin/links/{rid}")
async def links_delete(rid: str, uid: str = User):
    n = await db.run("DELETE FROM hoshin_links l USING hoshin_objectives o WHERE l.id = %s AND l.objective_id = o.id AND o.user_id = %s", as_uuid(rid), uid)
    if not n:
        raise ApiError(404, "not found")
    return {}

def month_out(m): return {"id": str(m["id"]), "month": m["month"], "year": m["year"], "status": m["status"], "actual": conv(m["actual"]), "target": conv(m["target"])}

@router.get("/api/hoshin/bowling")
async def bowling_list(request: Request, uid: str = User):
    y = request.query_params.get("year") or str(dt.date.today().year)
    if not y.isdigit():
        fail("year must be a number")
    objs = await db.rows("SELECT * FROM bowling_objectives WHERE user_id = %s ORDER BY sort_order, created_at", uid)
    months = await db.rows("SELECT m.* FROM bowling_months m JOIN bowling_objectives o ON o.id = m.objective_id WHERE o.user_id = %s AND m.year = %s ORDER BY m.month", uid, int(y)) if objs else []
    return [{"id": str(o["id"]), "title": o["title"], "sort_order": o["sort_order"],
             "months": [month_out(m) for m in months if m["objective_id"] == o["id"]]} for o in objs]

@router.post("/api/hoshin/bowling", status_code=201)
async def bowling_create(request: Request, uid: str = User):
    v = parse_fields([F("title", required=True, maxlen=300)], await body(request))
    n = await db.one("SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM bowling_objectives WHERE user_id = %s", uid)
    row = await db.one("INSERT INTO bowling_objectives (user_id, title, sort_order) VALUES (%s,%s,%s) RETURNING *", uid, v["title"], n["n"])
    return {"id": str(row["id"]), "title": row["title"], "sort_order": row["sort_order"], "months": []}

@router.delete("/api/hoshin/bowling/{rid}")
async def bowling_delete(rid: str, uid: str = User):
    rid = as_uuid(rid)
    async with db.pool.connection() as c:
        async with c.transaction():
            cur = await c.execute("DELETE FROM bowling_objectives WHERE id = %s AND user_id = %s RETURNING id", (rid, uid))
            if not await cur.fetchall():
                raise ApiError(404, "not found")
            await c.execute("DELETE FROM bowling_months WHERE objective_id = %s", (rid,))
    return {}

MONTH_FIELDS = [F("month", kind="int", required=True, lo=1, hi=12), F("year", kind="int", required=True, lo=2000, hi=2100),
                F("status", choices=["not-started", "in-progress", "achieved", "missed"], default="not-started"),
                F("actual", kind="num", default=0.0), F("target", kind="num", default=0.0)]

@router.put("/api/hoshin/bowling/{rid}/months")
async def bowling_month(rid: str, request: Request, uid: str = User):
    v = parse_fields(MONTH_FIELDS, await body(request))
    obj = await db.one("SELECT id FROM bowling_objectives WHERE id = %s AND user_id = %s", as_uuid(rid), uid)
    if not obj:
        raise ApiError(404, "not found")
    row = await db.one("INSERT INTO bowling_months (objective_id, month, year, status, actual, target) VALUES (%s,%s,%s,%s,%s,%s) "
                       "ON CONFLICT (objective_id, year, month) DO UPDATE SET status = EXCLUDED.status, actual = EXCLUDED.actual, "
                       "target = EXCLUDED.target, updated_at = now() RETURNING *", obj["id"], v["month"], v["year"], v["status"], v["actual"], v["target"])
    return month_out(row)

# ---------------------------------------------------------------- weekly review
REVIEW_FIELDS = [F("week_start", kind="date", nullable=True), F("wins", default=""), F("challenges", default=""),
                 F("next_goals", default=""), F("morale", kind="int", default=3, lo=1, hi=5)]

def review_out(r): return {"id": str(r["id"]), "week_start": conv(r["week_start"]), "wins": r["wins"], "challenges": r["challenges"],
                           "next_goals": r["next_goals"], "morale": r["morale"], "created_at": conv(r["created_at"])}

@router.get("/api/reviews")
async def reviews_list(uid: str = User):
    return [review_out(r) for r in await db.rows("SELECT * FROM weekly_reviews WHERE user_id = %s ORDER BY week_start DESC LIMIT 200", uid)]

@router.get("/api/reviews/this-week")
async def reviews_this_week(uid: str = User):
    r = await db.one("SELECT * FROM weekly_reviews WHERE user_id = %s AND week_start = %s", uid, logic.week_start(dt.date.today()))
    return review_out(r) if r else None

@router.post("/api/reviews")
async def reviews_save(request: Request, uid: str = User):
    v = parse_fields(REVIEW_FIELDS, await body(request))
    week = v["week_start"] or logic.week_start(dt.date.today())
    existing = await db.one("SELECT id FROM weekly_reviews WHERE user_id = %s AND week_start = %s", uid, week)
    try:
        if existing:
            row = await db.one("UPDATE weekly_reviews SET wins=%s, challenges=%s, next_goals=%s, morale=%s WHERE id = %s RETURNING *",
                               v["wins"], v["challenges"], v["next_goals"], v["morale"], existing["id"])
        else:
            row = await db.one("INSERT INTO weekly_reviews (user_id, week_start, wins, challenges, next_goals, morale) VALUES (%s,%s,%s,%s,%s,%s) RETURNING *",
                               uid, week, v["wins"], v["challenges"], v["next_goals"], v["morale"])
    except Exception as e:
        raise db.db_error(e)
    return review_out(row)
