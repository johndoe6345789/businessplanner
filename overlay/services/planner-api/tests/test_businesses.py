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


def test_no_header_means_the_persons_own_business(owner):
    assert asyncio.run(auth.data_owner(Req())) == owner
    assert asyncio.run(auth.data_owner(Req("  "))) == owner


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
