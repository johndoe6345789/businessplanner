"""A person's own preferences: whether they appear on the leaderboard and whether they get the welcome and
re-engagement emails. These belong to the person, not to a business, so they use the signed-in id."""
from fastapi import APIRouter, Request

from . import db
from .core import fail
from .http import Owner, body

router = APIRouter()


async def read(owner: str) -> dict:
    row = await db.one("SELECT leaderboard_opt_in FROM users WHERE id = %s", owner)
    seq = await db.one("SELECT opted_out FROM email_sequence_state WHERE user_id = %s", owner)
    return {"leaderboardOptIn": bool(row["leaderboard_opt_in"]) if row else True,
            "emailSequences": not (seq and seq["opted_out"])}


@router.get("/api/planner/preferences")
async def get_preferences(owner: str = Owner):
    return await read(owner)


@router.put("/api/planner/preferences")
async def put_preferences(request: Request, owner: str = Owner):
    data = await body(request)
    if not isinstance(data, dict) or not (set(data) & {"leaderboardOptIn", "emailSequences"}) or not set(data) <= {"leaderboardOptIn", "emailSequences"}:
        fail("send leaderboardOptIn and/or emailSequences")
    for key in data:
        if not isinstance(data[key], bool):
            fail(f"{key} must be true or false")
    if "leaderboardOptIn" in data:
        await db.run("UPDATE users SET leaderboard_opt_in = %s WHERE id = %s", data["leaderboardOptIn"], owner)
    if "emailSequences" in data:
        await db.run("INSERT INTO email_sequence_state (user_id, opted_out) VALUES (%s, %s) "
                     "ON CONFLICT (user_id) DO UPDATE SET opted_out = EXCLUDED.opted_out", owner, not data["emailSequences"])
    return await read(owner)
