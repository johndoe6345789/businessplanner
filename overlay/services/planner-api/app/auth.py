"""Who is calling? The bearer token is checked by the auth daemon (which also provisions the user row on
first sight), so this service never needs to know about keys or issuers."""
import os
import time

import httpx
from fastapi import Request

from . import businesses, db
from .core import ApiError, as_uuid

AUTH_URL = f"http://{os.getenv('AUTH_HOST', 'businessplanner-auth')}:{os.getenv('AUTH_PORT', '9001')}/api/auth/me"
CACHE_SECONDS = 60
_cache: dict[str, tuple[str, float]] = {}
client: httpx.AsyncClient | None = None


async def start():
    global client
    client = httpx.AsyncClient(timeout=10)


async def stop():
    if client:
        await client.aclose()


async def current_user(request: Request) -> str:
    header = request.headers.get("authorization", "")
    if not header.lower().startswith("bearer ") or not header[7:].strip():
        raise ApiError(401, "Missing Authorization header")
    token = header[7:].strip()
    now = time.time()
    hit = _cache.get(token)
    if hit and hit[1] > now:
        return hit[0]
    try:
        r = await client.get(AUTH_URL, headers={"Authorization": "Bearer " + token})
    except httpx.HTTPError:
        raise ApiError(503, "The sign-in service is not answering")
    if r.status_code != 200:
        raise ApiError(401, "Invalid or expired token")
    uid = as_uuid(r.json().get("id"), "user")
    if len(_cache) > 2000:
        _cache.clear()
    _cache[token] = (uid, now + CACHE_SECONDS)
    return uid


async def data_owner(request: Request) -> str:
    """The id whose rows this request works on: the workspace of the business named by X-Business-Id, or of the
    person's oldest business when none is named. Every business has a hidden workspace user that owns its rows."""
    who = await current_user(request)
    named = request.headers.get("x-business-id", "").strip()
    if not named:
        return await businesses.first_workspace(who)
    row = await db.one("SELECT data_user_id FROM businesses WHERE id = %s AND owner_id = %s", as_uuid(named, "business"), who)
    if not row:
        raise ApiError(404, "business not found")
    return str(row["data_user_id"])
