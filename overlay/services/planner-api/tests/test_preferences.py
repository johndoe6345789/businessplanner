"""Leaderboard and email preferences: what is read, what is written, what is refused."""
import asyncio

import pytest

from app import routes_preferences as rp
from app.core import ApiError

OWNER = "11111111-1111-4111-8111-111111111111"


class Req:
    def __init__(self, data):
        self.data = data

    async def json(self):
        return self.data


@pytest.fixture
def store(monkeypatch):
    s = {"leaderboard_opt_in": True, "seq": None, "writes": []}

    async def one(sql, *a):
        if "FROM users" in sql:
            return {"leaderboard_opt_in": s["leaderboard_opt_in"]}
        return {"opted_out": s["seq"]} if s["seq"] is not None else None

    async def run(sql, *a):
        s["writes"].append((sql.split()[0], a))
        if sql.startswith("UPDATE users"):
            s["leaderboard_opt_in"] = a[0]
        else:
            s["seq"] = a[1]
        return 1
    monkeypatch.setattr(rp.db, "one", one)
    monkeypatch.setattr(rp.db, "run", run)

    async def body(request):
        return request.data
    monkeypatch.setattr(rp, "body", body)
    return s


def test_defaults_are_on(store):
    assert asyncio.run(rp.get_preferences(OWNER)) == {"leaderboardOptIn": True, "emailSequences": True}


def test_leaderboard_can_be_switched_off_and_on(store):
    r = asyncio.run(rp.put_preferences(Req({"leaderboardOptIn": False}), OWNER))
    assert r["leaderboardOptIn"] is False and r["emailSequences"] is True
    r = asyncio.run(rp.put_preferences(Req({"leaderboardOptIn": True}), OWNER))
    assert r["leaderboardOptIn"] is True


def test_emails_can_be_switched_off_and_back_on(store):
    r = asyncio.run(rp.put_preferences(Req({"emailSequences": False}), OWNER))
    assert r["emailSequences"] is False
    r = asyncio.run(rp.put_preferences(Req({"emailSequences": True}), OWNER))
    assert r["emailSequences"] is True


@pytest.mark.parametrize("bad", [{}, [], {"other": True}, {"leaderboardOptIn": "yes"}, {"leaderboardOptIn": True, "x": 1}])
def test_bad_requests_are_refused(store, bad):
    with pytest.raises(ApiError):
        asyncio.run(rp.put_preferences(Req(bad), OWNER))
    assert store["writes"] == []
