"""PostgreSQL access (psycopg 3, async pool) and the small schema patch this service needs."""
import logging
import os

import psycopg
from psycopg.rows import dict_row
from psycopg_pool import AsyncConnectionPool

from .core import ApiError

log = logging.getLogger("planner.db")
pool: AsyncConnectionPool | None = None


def dsn() -> str:
    return (f"host={os.getenv('DB_HOST', 'db')} port={os.getenv('DB_PORT', '5432')} dbname={os.getenv('DB_NAME', 'businessplanner_db')} "
            f"user={os.getenv('DB_USER', 'businessplanner')} password={os.getenv('DB_PASSWORD', '')}")


# Where the tables (created by the services' own migrations) are narrower than what the frontend sends.
# Applied on every start; each step is a no-op once done.
ADD_COLUMNS = [
    "ALTER TABLE kpi_metrics ADD COLUMN IF NOT EXISTS period_start date",
    "ALTER TABLE kpi_metrics ADD COLUMN IF NOT EXISTS period_end date",
    "ALTER TABLE personas ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT ''",
]
CREATE_TABLES = [
    """CREATE TABLE IF NOT EXISTS planner_progress (
         user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         step_id    text NOT NULL,
         completed  boolean NOT NULL DEFAULT true,
         created_at timestamptz NOT NULL DEFAULT now(),
         updated_at timestamptz NOT NULL DEFAULT now(),
         PRIMARY KEY (user_id, step_id))""",
]
CREATE_TABLES.append(
    """CREATE TABLE IF NOT EXISTS businesses (
         id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         owner_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
         data_user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
         name         text NOT NULL,
         is_default   boolean NOT NULL DEFAULT false,
         created_at   timestamptz NOT NULL DEFAULT now())""")
CREATE_TABLES.append("CREATE UNIQUE INDEX IF NOT EXISTS businesses_one_default ON businesses (owner_id) WHERE is_default")
# No cloud model key exists here; the bundled model is reached through the OpenAI-compatible client, so that is
# what new accounts use (people with their own Anthropic key can still choose Claude in their settings).
CREATE_TABLES.append("ALTER TABLE users ALTER COLUMN ai_provider SET DEFAULT 'openai'")
CREATE_TABLES.append("CREATE UNIQUE INDEX IF NOT EXISTS businesses_owner_name ON businesses (owner_id, lower(name))")
WIDEN_CHECKS = [  # (table, column, every allowed value)
    ("kpi_metrics", "category", ["financial", "operational", "customer", "strategic", "growth"]),
    ("okr_objectives", "status", ["active", "achieved", "at-risk", "abandoned", "completed", "cancelled"]),
    ("pdca_cycles", "status", ["not-started", "on-track", "at-risk", "blocked", "completed", "in-progress"]),
]


async def widen_check(conn, table, col, values):
    cur = await conn.execute("SELECT conname, pg_get_constraintdef(oid) AS d FROM pg_constraint WHERE conrelid = %s::regclass AND contype = 'c'", (table,))
    for r in await cur.fetchall():
        if f"{col} = ANY" in r["d"]:
            if all(f"'{v}'" in r["d"] for v in values):
                return
            await conn.execute(f'ALTER TABLE {table} DROP CONSTRAINT "{r["conname"]}"')
    allowed = ", ".join("'" + v + "'" for v in values)
    await conn.execute(f"ALTER TABLE {table} ADD CONSTRAINT {table}_{col}_check CHECK ({col} IN ({allowed}))")
    log.info("widened %s.%s", table, col)


async def start():
    global pool
    pool = AsyncConnectionPool(dsn(), min_size=1, max_size=int(os.getenv("DB_POOL", "8")), kwargs={"row_factory": dict_row}, open=False)
    await pool.open(wait=True, timeout=60)
    async with pool.connection() as conn:
        async with conn.transaction():
            await conn.execute("SELECT pg_advisory_xact_lock(7340001)")  # one starter at a time
            for stmt in CREATE_TABLES + ADD_COLUMNS:
                await conn.execute(stmt)
            for table, col, values in WIDEN_CHECKS:
                await widen_check(conn, table, col, values)


async def stop():
    if pool:
        await pool.close()


async def rows(sql, *args):
    async with pool.connection() as c:
        cur = await c.execute(sql, args)
        return await cur.fetchall()


async def one(sql, *args):
    found = await rows(sql, *args)
    return found[0] if found else None


async def run(sql, *args) -> int:
    async with pool.connection() as c:
        cur = await c.execute(sql, args)
        return cur.rowcount


def db_error(e: Exception) -> ApiError:
    """Map a database complaint about the caller's data to a 4xx; anything else is ours (500)."""
    if isinstance(e, psycopg.errors.ForeignKeyViolation):
        return ApiError(400, "that refers to something that does not exist")
    if isinstance(e, psycopg.errors.UniqueViolation):
        return ApiError(409, "that already exists")
    if isinstance(e, (psycopg.errors.CheckViolation, psycopg.errors.NotNullViolation, psycopg.errors.InvalidTextRepresentation,
                      psycopg.errors.NumericValueOutOfRange, psycopg.errors.InvalidDatetimeFormat, psycopg.errors.StringDataRightTruncation)):
        return ApiError(400, "that value is not allowed")
    raise e
