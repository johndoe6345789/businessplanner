"""Self-service sign-up (POST /api/auth/register).

Login belongs to the shared dbal. It has no public registration; the only way to create a login is its
admin-token endpoint, which *sets or resets* a password. So this runs as its own container, the only one
holding that token, and is careful never to overwrite an existing account:

* the dbal username is generated (`bp_` + random hex: it cannot be one of dbal's plain system names such as
  `admin` or `god`) and the e-mail address is registered as the alternate login identifier, so people sign in
  with their e-mail;
* an address already known here (users or earlier sign-ups) is refused;
* sign-ups are rate limited per client and overall.
"""
import asyncio
import logging
import os
import re
import secrets
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from . import db

log = logging.getLogger("signup")
DBAL_URL = os.getenv("DBAL_URL", "http://srv-captain--metabuilder-dbal:8080").rstrip("/")
LOGIN_PATH = os.getenv("LOGIN_PATH", "/app/en/login")
EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")
COMMON = {"password", "password1", "123456789", "1234567890", "qwertyuiop", "letmein123", "iloveyou12", "administrator"}
PER_CLIENT, PER_HOUR = int(os.getenv("SIGNUP_PER_CLIENT", "5")), int(os.getenv("SIGNUP_PER_HOUR", "200"))
_hits: dict[str, deque] = defaultdict(deque)
_all: deque = deque()


class Refused(Exception):
    def __init__(self, status, message):
        self.status, self.message = status, message


def check_rate(client: str, now: float | None = None):
    now = time.time() if now is None else now
    for q in (_hits[client], _all):
        while q and now - q[0] > 3600:
            q.popleft()
    if len(_hits[client]) >= PER_CLIENT or len(_all) >= PER_HOUR:
        raise Refused(429, "Too many sign-ups right now. Please try again later.")
    _hits[client].append(now)
    _all.append(now)


def validate(body: dict) -> tuple[str, str, str]:
    if not isinstance(body, dict):
        raise Refused(400, "Invalid request.")
    if body.get("website"):                       # honeypot: real users never fill this in
        raise Refused(400, "Invalid request.")
    email = str(body.get("email") or "").strip().lower()
    password = str(body.get("password") or "")
    name = str(body.get("displayName") or body.get("username") or "").strip()[:128]
    if not EMAIL_RE.match(email) or len(email) > 128:
        raise Refused(400, "Enter a valid e-mail address.")
    if not 10 <= len(password) <= 128:
        raise Refused(400, "Use a password of 10 to 128 characters.")
    if password.isdigit() or password.lower() in COMMON or password.lower() == email:
        raise Refused(400, "That password is too easy to guess. Choose another.")
    return email, password, name or email.split("@")[0]


def new_username() -> str:
    return "bp_" + secrets.token_hex(8)


async def dbal_set_credential(username: str, email: str, password: str):
    token = os.getenv("DBAL_ADMIN_TOKEN", "")
    if not token:
        raise Refused(503, "Sign-up is not configured.")
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.post(f"{DBAL_URL}/admin/credentials", headers={"Authorization": f"Bearer {token}"},
                         json={"username": username, "password": password, "email": email})
    if r.status_code != 200 or not r.json().get("success"):
        log.warning("dbal refused the credential (%s): %s", r.status_code, r.text[:200])
        raise Refused(502, "Could not create the account. Please try again later.")


async def register(body: dict, client: str):
    email, password, name = validate(body)
    check_rate(client)
    if await db.one("SELECT 1 AS x FROM users WHERE lower(email) = %s", email):
        raise Refused(409, "That e-mail address is already registered. Try signing in.")
    username = new_username()
    claimed = await db.one(
        "INSERT INTO signup_accounts (email, display_name, username) VALUES (%s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING email",
        email, name, username)
    if not claimed:
        raise Refused(409, "That e-mail address is already registered. Try signing in.")
    try:
        await dbal_set_credential(username, email, password)
    except Exception:
        await db.run("DELETE FROM signup_accounts WHERE email = %s", email)    # let them try again
        raise


# People who sign in only appear in `users` on their first login, as `<username>@unknown.local` (the login service
# gives no e-mail or name). Fill in what we were told at sign-up so the app shows their name and has an address.
SYNC_SQL = ("UPDATE users u SET email = s.email, display_name = s.display_name, updated_at = now() FROM signup_accounts s "
            "WHERE u.username = s.username AND u.email LIKE '%%@unknown.local' "
            "AND NOT EXISTS (SELECT 1 FROM users o WHERE lower(o.email) = s.email AND o.id <> u.id)")


async def sync_profiles_forever(every: float = 15):
    while True:
        try:
            await db.run(SYNC_SQL)
        except Exception:
            log.exception("profile sync failed")
        await asyncio.sleep(every)


@asynccontextmanager
async def lifespan(app):
    await db.start()
    await db.run("""CREATE TABLE IF NOT EXISTS signup_accounts (
        email text PRIMARY KEY, display_name text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now())""")
    await db.run("ALTER TABLE signup_accounts ADD COLUMN IF NOT EXISTS username text")
    task = asyncio.create_task(sync_profiles_forever())
    yield
    task.cancel()
    await db.stop()


app = FastAPI(title="businessplanner-signup", lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)


def client_of(req: Request) -> str:
    """The caller's address. Behind CapRover the chain is "<whatever the caller sent>, <caller>, <proxy>": only the
    entry the first trusted proxy added can be believed, so take the second from the end."""
    chain = [p.strip() for p in req.headers.get("x-forwarded-for", "").split(",") if p.strip()]
    if chain:
        return chain[-2] if len(chain) >= 2 else chain[-1]
    return req.client.host if req.client else "unknown"


@app.post("/api/auth/register")
async def register_route(req: Request):
    try:
        body = await req.json()
    except ValueError:
        body = None
    try:
        await register(body, client_of(req))
    except Refused as e:
        return JSONResponse({"message": e.message, "error": e.message}, status_code=e.status)
    return JSONResponse({"success": True, "message": "Account created. Sign in with your e-mail address and password.",
                         "loginUrl": LOGIN_PATH}, status_code=201)


@app.get("/healthz")
async def healthz():
    await db.one("SELECT 1 AS ok")
    return {"status": "ok"}
