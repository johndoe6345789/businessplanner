"""Which roadmap steps are ticked off, kept on the server so progress follows the person from device to device."""
import re

from fastapi import APIRouter, Request

from . import db
from .core import ApiError, fail
from .http import User, body

router = APIRouter()
STEP_ID = re.compile(r"^[A-Za-z0-9_.:-]{1,100}$")
MAX_STEPS = 500


@router.get("/api/planner/progress")
async def progress(uid: str = User):
    rows = await db.rows("SELECT step_id FROM planner_progress WHERE user_id = %s AND completed", uid)
    return {"steps": {r["step_id"]: True for r in rows}}


@router.put("/api/planner/progress/{step_id}")
async def set_step(step_id: str, request: Request, uid: str = User):
    """Tick or untick a step. `first_time` is true only the very first time this person ever ticks it, so that
    points can be awarded once (unticking and ticking again does not count as new)."""
    if not STEP_ID.match(step_id):
        raise ApiError(404, "step not found")
    data = await body(request)
    if not isinstance(data, dict) or not isinstance(data.get("completed"), bool):
        fail("completed must be true or false")
    n = await db.one("SELECT COUNT(*) AS n FROM planner_progress WHERE user_id = %s AND step_id <> %s", uid, step_id)
    if n["n"] >= MAX_STEPS:
        fail("too many steps")
    row = await db.one("INSERT INTO planner_progress (user_id, step_id, completed) VALUES (%s, %s, %s) "
                       "ON CONFLICT (user_id, step_id) DO UPDATE SET completed = EXCLUDED.completed, updated_at = now() "
                       "RETURNING (xmax = 0) AS inserted", uid, step_id, data["completed"])
    return {"step": step_id, "completed": data["completed"], "first_time": bool(row["inserted"]) and data["completed"]}


@router.delete("/api/planner/progress")
async def reset(uid: str = User):
    await db.run("UPDATE planner_progress SET completed = false, updated_at = now() WHERE user_id = %s", uid)
    return {}
