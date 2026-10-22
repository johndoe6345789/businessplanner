"""One account, several equal businesses (see businesses.py). Any of them can be renamed or deleted; a person always
keeps at least one, so deleting the last gives them a fresh empty one."""
import re

from fastapi import APIRouter, Request

from . import businesses, db
from .core import ApiError, as_uuid, conv, fail
from .http import Owner, body

router = APIRouter()
MAX_BUSINESSES = 20


def clean_name(data) -> str:
    if not isinstance(data, dict) or not isinstance(data.get("name"), str):
        fail("name is required")
    name = re.sub(r"\s+", " ", re.sub(r"[\x00-\x1f\x7f]", " ", data["name"])).strip()
    if not 1 <= len(name) <= 80:
        fail("the name must be 1 to 80 characters")
    return name


def out(r) -> dict:
    return {"id": str(r["id"]), "name": r["name"], "createdAt": conv(r["created_at"])}


async def listing(owner: str):
    await businesses.ensure_business(owner)
    return [out(r) for r in await db.rows("SELECT * FROM businesses WHERE owner_id = %s ORDER BY created_at, id", owner)]


@router.get("/api/businesses")
async def list_businesses(owner: str = Owner):
    return await listing(owner)


@router.post("/api/businesses", status_code=201)
async def create_business(request: Request, owner: str = Owner):
    name = clean_name(await body(request))
    await businesses.ensure_business(owner)
    if (await db.one("SELECT COUNT(*) AS n FROM businesses WHERE owner_id = %s", owner))["n"] >= MAX_BUSINESSES:
        fail(f"you can have up to {MAX_BUSINESSES} businesses")
    if await db.one("SELECT 1 AS x FROM businesses WHERE owner_id = %s AND lower(name) = lower(%s)", owner, name):
        raise ApiError(409, "you already have a business with that name")
    async with db.pool.connection() as conn:
        async with conn.transaction():
            row = await businesses.make_business(conn, owner, name)
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
    # Deleting the workspace user removes the business and every plan row it owned (all cascade).
    await db.run("DELETE FROM users WHERE id = %s AND is_active = false AND role = 'guest'", row["data_user_id"])
    return {}


@router.get("/api/planner/whoami")
async def whoami(owner: str = Owner):
    """The name and address the person gave when signing up. The login token carries only an internal username,
    so the app asks here for what to show."""
    row = await db.one("SELECT display_name, email FROM users WHERE id = %s", owner)
    email = row["email"] if row and not row["email"].endswith("@unknown.local") else ""
    return {"displayName": (row["display_name"] if row else "") or "", "email": email}
