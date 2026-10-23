"""Business scoping: which id a request works on, and what a business name may be."""
import asyncio

import pytest

from app import auth, routes_businesses as rb
from app.core import ApiError


class Req:
    def __init__(self, business=None):
        self.headers = {"authorization": "Bearer t"}
        if business is not None:
            self.headers["x-business-id"] = business


@pytest.fixture
def owner(monkeypatch):
    me = "11111111-1111-4111-8111-111111111111"

    async def who(request):
        return me
    monkeypatch.setattr(auth, "current_user", who)
    return me


def test_no_header_means_the_oldest_business(owner, monkeypatch):
    ws = "44444444-4444-4444-8444-444444444444"
    seen = []

    async def first(person):
        seen.append(person)
        return ws
    monkeypatch.setattr(auth.businesses, "first_workspace", first)
    assert asyncio.run(auth.data_owner(Req())) == ws
    assert asyncio.run(auth.data_owner(Req("  "))) == ws
    assert seen == [owner, owner]


def test_every_business_can_be_deleted(owner, monkeypatch):
    ws = "55555555-5555-4555-8555-555555555555"
    ran = []

    async def one(sql, *a):
        return {"id": a[0], "data_user_id": ws, "name": "Any"}

    async def run(sql, *a):
        ran.append((sql, a))
        return 1
    monkeypatch.setattr(rb.db, "one", one)
    monkeypatch.setattr(rb.db, "run", run)
    asyncio.run(rb.delete_business("66666666-6666-4666-8666-666666666666", owner))
    assert ran and ran[0][1] == (ws,)


def test_the_listing_has_no_main_flag():
    row = {"id": "x", "name": "N", "created_at": "2026-01-01"}
    assert "isDefault" not in rb.out(row)


def test_a_named_business_resolves_to_its_workspace_user(owner, monkeypatch):
    ws = "22222222-2222-4222-8222-222222222222"
    seen = {}

    async def one(sql, *a):
        seen["args"] = a
        return {"data_user_id": ws}
    monkeypatch.setattr(auth.db, "one", one)
    bid = "33333333-3333-4333-8333-333333333333"
    assert asyncio.run(auth.data_owner(Req(bid))) == ws
    assert seen["args"] == (bid, owner)           # looked up by owner too: someone else's id finds nothing


def test_someone_elses_or_unknown_business_is_not_found(owner, monkeypatch):
    async def one(sql, *a):
        return None
    monkeypatch.setattr(auth.db, "one", one)
    with pytest.raises(ApiError) as e:
        asyncio.run(auth.data_owner(Req("33333333-3333-4333-8333-333333333333")))
    assert e.value.status == 404
    with pytest.raises(ApiError) as e:
        asyncio.run(auth.data_owner(Req("not-a-uuid")))
    assert e.value.status == 404


def test_names():
    assert rb.clean_name({"name": "  Acme \n Ltd  "}) == "Acme Ltd"
    for bad in ({}, {"name": 5}, {"name": "   "}, {"name": "x" * 81}, None):
        with pytest.raises(ApiError):
            rb.clean_name(bad)


def test_there_is_no_limit_on_how_many_businesses(owner, monkeypatch):
    """The old cap of 20 is gone: creating a 21st (or 200th) business is allowed."""
    made = []

    async def one(sql, *a):
        assert "COUNT" not in sql, "creating a business must not count the existing ones"
        return None

    async def ensure(person):
        return None

    class Conn:
        async def __aenter__(self): return self
        async def __aexit__(self, *a): return False
        def transaction(self): return self

    class Pool:
        def connection(self): return Conn()

    async def make(conn, person, name):
        made.append(name)
        return {"id": "1", "name": name, "created_at": "2026-01-01"}

    class Req:
        async def json(self): return {"name": "Business 201"}

    async def body(request): return await request.json()
    monkeypatch.setattr(rb.db, "one", one)
    monkeypatch.setattr(rb.db, "pool", Pool(), raising=False)
    monkeypatch.setattr(rb.businesses, "ensure_business", ensure)
    monkeypatch.setattr(rb.businesses, "make_business", make)
    monkeypatch.setattr(rb, "body", body)
    asyncio.run(rb.create_business(Req(), owner))
    assert made == ["Business 201"]
    assert not hasattr(rb, "MAX_BUSINESSES")
