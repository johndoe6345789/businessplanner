"""Shared route plumbing."""
from fastapi import Depends, Request

from .auth import current_user, data_owner
from .core import fail

# `User` is whose data a planning route reads and writes: the caller's own (their main business) or, when the
# request names one in X-Business-Id, the hidden workspace row that holds that business's data.
User = Depends(data_owner)
# `Owner` is the real signed-in person, for the routes that manage the businesses themselves.
Owner = Depends(current_user)


async def body(request: Request):
    try:
        return await request.json()
    except Exception:
        fail("the request body must be valid JSON")


def mount_crud(router, base, res, *, update=True, search=None, created=201):
    """list / create / replace / delete for a Resource under `base`."""

    @router.get(base)
    async def list_(request: Request, uid: str = User):
        q = request.query_params.get("q") or request.query_params.get("search")
        if search and q:
            where = " AND (" + " OR ".join(f"{c}::text ILIKE %s" for c in search) + ")"
            return await res.list(uid, where, tuple(f"%{q}%" for _ in search))
        return await res.list(uid)

    @router.post(base, status_code=created)
    async def create_(request: Request, uid: str = User):
        return await res.create(uid, await body(request))

    if update:
        @router.put(base + "/{rid}")
        async def replace_(rid: str, request: Request, uid: str = User):
            return await res.replace(uid, rid, await body(request))

    @router.delete(base + "/{rid}")
    async def delete_(rid: str, uid: str = User):
        return await res.delete(uid, rid)
