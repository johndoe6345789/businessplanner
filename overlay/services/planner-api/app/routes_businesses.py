"""One account, several businesses. A person's own data is their main business; every further business gets a
hidden workspace user that owns its rows, so each planning table keeps working unchanged (see auth.data_owner).
The workspace users can never sign in: they are inactive guests with no password and no leaderboard entry."""
import re
import secrets

from fastapi import APIRouter, Request

from . import db
from .core import ApiError, as_uuid, conv, fail
from .http import Owner, body

router = APIRouter()
MAX_BUSINESSES = 20
DEFAULT_NAME = "My business"


def clean_name(data) -> str:
    if not isinstance(data, dict) or not isinstance(data.get("name"), str):
        fail("name is required")
    name = re.sub(r"\s+", " ", re.sub(r"[\x00-\x1f\x7f]", " ", data["name"])).strip()
    if not 1 <= len(name) <= 80:
        fail("the name must be 1 to 80 characters")
    return name


def out(r) -> dict:
    return {"id": str(r["id"]), "name": r["name"], "isDefault": bool(r["is_default"]), "createdAt": conv(r["created_at"])}


async def ensure_default(owner: str):
    await db.run("INSERT INTO businesses (owner_id, data_user_id, name, is_default) VALUES (%s, %s, %s, true) ON CONFLICT DO NOTHING",
                 owner, owner, DEFAULT_NAME)


async def listing(owner: str):
    return [out(r) for r in await db.rows("SELECT * FROM businesses WHERE owner_id = %s ORDER BY is_default DESC, created_at", owner)]


@router.get("/api/businesses")
async def list_businesses(owner: str = Owner):
    await ensure_default(owner)
    return await listing(owner)


@router.post("/api/businesses", status_code=201)
async def create_business(request: Request, owner: str = Owner):
    name = clean_name(await body(request))
    await ensure_default(owner)
    if (await db.one("SELECT COUNT(*) AS n FROM businesses WHERE owner_id = %s", owner))["n"] >= MAX_BUSINESSES:
        fail(f"you can have up to {MAX_BUSINESSES} businesses")
    if await db.one("SELECT 1 AS x FROM businesses WHERE owner_id = %s AND lower(name) = lower(%s)", owner, name):
        raise ApiError(409, "you already have a business with that name")
    token = secrets.token_hex(8)
    async with db.pool.connection() as conn:
        async with conn.transaction():
            cur = await conn.execute(
                "INSERT INTO users (email, username, password_hash, display_name, is_active, role, leaderboard_opt_in) "
                "VALUES (%s, %s, '!', %s, false, 'guest', false) RETURNING id",
                (f"workspace-{token}@workspaces.invalid", f"ws_{token}", name))
            ws = (await cur.fetchone())["id"]
            cur = await conn.execute("INSERT INTO businesses (owner_id, data_user_id, name) VALUES (%s, %s, %s) RETURNING *", (owner, ws, name))
            row = await cur.fetchone()
    return out(row)


@router.put("/api/businesses/{bid}")
async def rename_business(bid: str, request: Request, owner: str = Owner):
    name = clean_name(await body(request))
    try:
        row = await db.one("UPDATE businesses SET name = %s WHERE id = %s AND owner_id = %s RETURNING *", name, as_uuid(bid, "business"), owner)
    except Exception as e:
        raise db.db_error(e)
    if not row:
        raise ApiError(404, "business not found")
    return out(row)


@router.delete("/api/businesses/{bid}")
async def delete_business(bid: str, owner: str = Owner):
    row = await db.one("SELECT * FROM businesses WHERE id = %s AND owner_id = %s", as_uuid(bid, "business"), owner)
    if not row:
        raise ApiError(404, "business not found")
    if row["is_default"]:
        fail("your main business cannot be deleted")
    # Deleting the workspace user removes the business and every plan row it owned (all cascade).
    await db.run("DELETE FROM users WHERE id = %s AND is_active = false AND role = 'guest'", row["data_user_id"])
    return {}
