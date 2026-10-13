"""A generic 'your own rows in one table' resource: list, create, replace, delete."""
from . import db
from .core import ApiError, as_uuid, conv, parse_fields


class Resource:
    def __init__(self, table, fields, *, user_key="user_id", ts=(("created_at", "created_at"), ("updated_at", "updated_at")),
                 order="created_at DESC", touch=True, pre=None, post=None, extra_cols=()):
        self.table, self.fields, self.user_key, self.ts = table, fields, user_key, ts
        self.order, self.touch, self.pre, self.post = order, touch, pre, post
        self.extra_cols = extra_cols  # (api name, column) read-only outputs

    def out(self, row) -> dict:
        d = {"id": str(row["id"]), self.user_key: str(row["user_id"])}
        for f in self.fields:
            d[f.api] = conv(row[f.col])
        for api, col in self.ts:
            d[api] = conv(row[col])
        for api, col in self.extra_cols:
            d[api] = conv(row[col])
        return self.post(row, d) if self.post else d

    async def list(self, uid, where="", args=(), order=None):
        rows = await db.rows(f"SELECT * FROM {self.table} WHERE user_id = %s {where} ORDER BY {order or self.order}", uid, *args)
        return [self.out(r) for r in rows]

    def values(self, data):
        vals = parse_fields(self.fields, data)
        return self.pre(vals, data) if self.pre else vals

    async def create(self, uid, data):
        vals = self.values(data)
        cols = ["user_id", *vals]
        try:
            row = await db.one(f"INSERT INTO {self.table} ({', '.join(cols)}) VALUES ({', '.join(['%s'] * len(cols))}) RETURNING *", uid, *vals.values())
        except Exception as e:
            raise db.db_error(e)
        return self.out(row)

    async def replace(self, uid, rid, data):
        rid = as_uuid(rid)
        vals = self.values(data)
        sets = [f"{c} = %s" for c in vals] + (["updated_at = now()"] if self.touch else [])
        try:
            row = await db.one(f"UPDATE {self.table} SET {', '.join(sets)} WHERE id = %s AND user_id = %s RETURNING *", *vals.values(), rid, uid)
        except Exception as e:
            raise db.db_error(e)
        if not row:
            raise ApiError(404, "not found")
        return self.out(row)

    async def delete(self, uid, rid):
        rid = as_uuid(rid)
        if not await db.run(f"DELETE FROM {self.table} WHERE id = %s AND user_id = %s", rid, uid):
            raise ApiError(404, "not found")
        return {}

    async def get(self, uid, rid):
        row = await db.one(f"SELECT * FROM {self.table} WHERE id = %s AND user_id = %s", as_uuid(rid), uid)
        if not row:
            raise ApiError(404, "not found")
        return self.out(row)


class Singleton:
    """One row per user (keyed by user_id), read with defaults, saved by upsert."""

    def __init__(self, table, fields, *, ts=("updated_at", "updated_at")):
        self.table, self.fields, self.ts = table, fields, ts

    def out(self, row) -> dict:
        d = {}
        for f in self.fields:
            d[f.api] = conv(row[f.col]) if row else (f.default if f.default is not None and not callable(f.default) else None)
        return d

    async def read(self, uid):
        return self.out(await db.one(f"SELECT * FROM {self.table} WHERE user_id = %s", uid))

    async def save(self, uid, data):
        vals = parse_fields(self.fields, data)
        cols = ["user_id", *vals]
        upd = ", ".join(f"{c} = EXCLUDED.{c}" for c in vals) + ", updated_at = now()"
        try:
            row = await db.one(f"INSERT INTO {self.table} ({', '.join(cols)}) VALUES ({', '.join(['%s'] * len(cols))}) "
                               f"ON CONFLICT (user_id) DO UPDATE SET {upd} RETURNING *", uid, *vals.values())
        except Exception as e:
            raise db.db_error(e)
        return self.out(row)
