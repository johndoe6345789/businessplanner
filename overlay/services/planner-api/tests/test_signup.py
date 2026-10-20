"""Sign-up never overwrites an existing account and refuses bad input."""
import pytest
from fastapi.testclient import TestClient

from app import signup


@pytest.fixture(autouse=True)
def fakes(monkeypatch):
    state = {"users": set(), "claimed": set(), "dbal": []}

    async def one(sql, *a):
        if "FROM users" in sql:
            return {"x": 1} if a[0] in state["users"] else None
        if "INSERT INTO signup_accounts" in sql:
            if a[0] in state["claimed"]:
                return None
            state["claimed"].add(a[0]); return {"email": a[0]}

    async def run(sql, *a):
        if "DELETE FROM signup_accounts" in sql:
            state["claimed"].discard(a[0])

    async def dbal(username, email, password):
        if state.get("dbal_fail"):
            raise signup.Refused(502, "no")
        state["dbal"].append((username, email, password))

    monkeypatch.setattr(signup.db, "one", one)
    monkeypatch.setattr(signup.db, "run", run)
    monkeypatch.setattr(signup, "dbal_set_credential", dbal)
    signup._hits.clear(); signup._all.clear()
    # build a client without running the lifespan (no database here)
    return state


@pytest.fixture
def client():
    from fastapi import FastAPI
    app = FastAPI(); app.router.routes = [r for r in signup.app.router.routes if getattr(r, "path", "") == "/api/auth/register"]
    return TestClient(app, raise_server_exceptions=False)


GOOD = {"email": "New.Person@Example.com", "password": "correct horse 99", "displayName": "New Person"}


def test_creates_the_login_with_the_lowercased_email(client, fakes):
    r = client.post("/api/auth/register", json=GOOD)
    assert r.status_code == 201 and r.json()["success"] is True
    (username, email, password), = fakes["dbal"]
    assert email == "new.person@example.com" and password == "correct horse 99"
    assert username.startswith("bp_") and 3 <= len(username) <= 50 and username.replace("_", "").isalnum()


def test_never_touches_dbal_for_an_address_it_already_knows(client, fakes):
    fakes["users"].add("new.person@example.com")
    assert client.post("/api/auth/register", json=GOOD).status_code == 409
    assert fakes["dbal"] == []
    fakes["users"].clear(); fakes["claimed"].add("new.person@example.com")
    assert client.post("/api/auth/register", json=GOOD).status_code == 409
    assert fakes["dbal"] == []


def test_a_failed_dbal_call_frees_the_address_again(client, fakes):
    fakes["dbal_fail"] = True
    assert client.post("/api/auth/register", json=GOOD).status_code == 502
    assert "new.person@example.com" not in fakes["claimed"]


@pytest.mark.parametrize("patch", [
    {"email": "admin"}, {"email": "a@b"}, {"password": "short"}, {"password": "1234567890"},
    {"password": "Password1"}, {"website": "http://spam.example"}, {"email": "x" * 130 + "@example.com"}])
def test_rejects_bad_input(client, fakes, patch):
    assert client.post("/api/auth/register", json={**GOOD, **patch}).status_code == 400
    assert fakes["dbal"] == []


def test_rate_limit_per_client(client, fakes):
    codes = [client.post("/api/auth/register", json={**GOOD, "email": f"u{i}@example.com"}, headers={"x-forwarded-for": "6.6.6.6, 1.2.3.4, 10.0.1.5"}).status_code for i in range(7)]
    assert codes[:5] == [201] * 5 and codes[5:] == [429, 429]
    assert client.post("/api/auth/register", json={**GOOD, "email": "other@example.com"}, headers={"x-forwarded-for": "5.6.7.8, 10.0.1.5"}).status_code == 201


def test_a_plain_login_name_is_not_an_email():
    with pytest.raises(signup.Refused):
        signup.validate({"email": "god", "password": "correct horse 99"})


def test_the_client_is_the_entry_the_first_proxy_added():
    class Req:
        def __init__(self, xff): self.headers = {"x-forwarded-for": xff} if xff else {}; self.client = None
    assert signup.client_of(Req("spoofed, 203.0.113.9, 10.0.1.5")) == "203.0.113.9"
    assert signup.client_of(Req("203.0.113.9")) == "203.0.113.9"
    assert signup.client_of(Req("")) == "unknown"


def test_profile_sync_only_touches_placeholder_emails_and_never_duplicates():
    sql = signup.SYNC_SQL
    assert "LIKE '%%@unknown.local'" in sql                       # %% = a literal % for the driver
    assert "u.username = s.username" in sql                       # matched by the generated dbal username
    assert "NOT EXISTS" in sql and "o.id <> u.id" in sql          # never creates a second row with the same address
