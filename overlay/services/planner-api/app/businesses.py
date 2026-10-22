"""Business workspaces. Every business owns a hidden workspace user whose id keys all of its planning rows, so each
planning table works unchanged. Workspace users can never sign in: inactive guests with no password, no leaderboard
entry. There is no special "main" business: a person has one or more equal businesses, and always at least one."""
import secrets

from . import db

DEFAULT_NAME = "My business"


async def make_business(conn, owner: str, name: str) -> dict:
    """Create a business and its workspace user inside the caller's transaction."""
    token = secrets.token_hex(8)
    cur = await conn.execute(
        "INSERT INTO users (email, username, password_hash, display_name, is_active, role, leaderboard_opt_in) "
        "VALUES (%s, %s, '!', %s, false, 'guest', false) RETURNING id",
        (f"workspace-{token}@workspaces.invalid", f"ws_{token}", name))
    ws = (await cur.fetchone())["id"]
    cur = await conn.execute("INSERT INTO businesses (owner_id, data_user_id, name) VALUES (%s, %s, %s) RETURNING *", (owner, ws, name))
    return await cur.fetchone()


async def ensure_business(owner: str):
    """A person always has a business to work in: a new account (or one that deleted its last business) gets an empty one."""
    if await db.one("SELECT 1 AS x FROM businesses WHERE owner_id = %s", owner):
        return
    try:
        async with db.pool.connection() as conn:
            async with conn.transaction():
                await conn.execute("SELECT pg_advisory_xact_lock(hashtext(%s))", (owner,))
                if not (await (await conn.execute("SELECT 1 AS x FROM businesses WHERE owner_id = %s", (owner,))).fetchone()):
                    await make_business(conn, owner, DEFAULT_NAME)
    except Exception as e:               # a parallel request made it first (unique name): that is fine
        if not await db.one("SELECT 1 AS x FROM businesses WHERE owner_id = %s", owner):
            raise e


async def first_workspace(owner: str) -> str:
    """The workspace of the person's oldest business: what a request without X-Business-Id works on."""
    await ensure_business(owner)
    row = await db.one("SELECT data_user_id FROM businesses WHERE owner_id = %s ORDER BY created_at, id LIMIT 1", owner)
    return str(row["data_user_id"])


# Every table the planning tools read and write for the open business, all keyed on user_id.
BUSINESS_TABLES = [
    "accelerator_programmes", "bmc_canvas", "bowling_objectives", "burn_inputs", "competitors", "decisions", "discovery_entries",
    "financial_hypotheses", "hoshin_objectives", "kill_criteria", "kpi_metrics", "okr_objectives", "organisations", "pdca_cycles",
    "personas", "pivots", "planner_progress", "pricing_inputs", "risks", "scoped_features", "tam_inputs", "unit_econ_inputs",
    "weekly_reviews", "xero_connections", "zelt_connections",
]


async def migrate_main_businesses() -> int:
    """Earlier versions kept a person's first ("main") business under their own user id. Give each such business its own
    workspace and move its rows there, so every business is the same and any of them can be deleted. Safe to re-run."""
    moved = 0
    async with db.pool.connection() as conn:
        async with conn.transaction():
            await conn.execute("SELECT pg_advisory_xact_lock(7340002)")
            owners = {}   # person id -> the business row that holds their own-id data (or None if they never opened the list)
            for r in await (await conn.execute("SELECT id, owner_id FROM businesses WHERE data_user_id = owner_id")).fetchall():
                owners[str(r["owner_id"])] = r["id"]
            for t in BUSINESS_TABLES:
                sql = (f"SELECT DISTINCT t.user_id FROM {t} t JOIN users u ON u.id = t.user_id "
                       "WHERE u.is_active AND NOT EXISTS (SELECT 1 FROM businesses b WHERE b.owner_id = t.user_id)")
                for r in await (await conn.execute(sql)).fetchall():
                    owners.setdefault(str(r["user_id"]), None)
            for owner, bid in owners.items():
                if bid is None:
                    biz = await make_business(conn, owner, DEFAULT_NAME)
                    ws = biz["data_user_id"]
                else:
                    name = (await (await conn.execute("SELECT name FROM businesses WHERE id = %s", (bid,))).fetchone())["name"]
                    cur = await conn.execute(
                        "INSERT INTO users (email, username, password_hash, display_name, is_active, role, leaderboard_opt_in) "
                        "VALUES (%s, %s, '!', %s, false, 'guest', false) RETURNING id",
                        (f"workspace-{secrets.token_hex(8)}@workspaces.invalid", f"ws_{secrets.token_hex(8)}", name))
                    ws = (await cur.fetchone())["id"]
                    await conn.execute("UPDATE businesses SET data_user_id = %s, is_default = false WHERE id = %s", (ws, bid))
                for t in BUSINESS_TABLES:
                    moved += (await conn.execute(f"UPDATE {t} SET user_id = %s WHERE user_id = %s", (ws, owner))).rowcount
    return moved
