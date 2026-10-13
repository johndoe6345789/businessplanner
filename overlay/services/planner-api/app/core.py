"""Shared pieces: errors, value conversion and request-field parsing."""
import datetime as dt
import decimal
import uuid

from psycopg.types.json import Jsonb


class ApiError(Exception):
    def __init__(self, status: int, message: str):
        super().__init__(message)
        self.status, self.message = status, message


def fail(message: str, status: int = 400):
    raise ApiError(status, message)


def conv(v):
    """Database value -> JSON-ready value."""
    if isinstance(v, decimal.Decimal):
        return int(v) if v == v.to_integral_value() else float(v)
    if isinstance(v, (dt.datetime, dt.date)):
        return v.isoformat()
    if isinstance(v, uuid.UUID):
        return str(v)
    if isinstance(v, (list, tuple)):
        return [conv(x) for x in v]
    if isinstance(v, dict):
        return {k: conv(x) for k, x in v.items()}
    return v


def as_uuid(value, what="id"):
    try:
        return str(uuid.UUID(str(value)))
    except (ValueError, AttributeError, TypeError):
        raise ApiError(404, f"{what} not found")


_MISSING = object()


class F:
    """One request field: its API name, the column it lives in, and how to validate it."""

    def __init__(self, api, col=None, kind="text", required=False, default=_MISSING,
                 choices=None, lo=None, hi=None, nullable=False, maxlen=20000):
        self.api, self.col, self.kind = api, col or api, kind
        self.required, self.default, self.choices = required, default, choices
        self.lo, self.hi, self.nullable, self.maxlen = lo, hi, nullable, maxlen

    def parse(self, data: dict):
        v = data.get(self.api, _MISSING)
        if v is _MISSING or (v is None and not self.nullable) or (v == "" and self.kind in ("date", "uuid", "int", "num")):
            if v == "" and self.nullable:
                return None
            if self.default is not _MISSING:
                return self.default
            if self.required:
                fail(f"{self.api} is required")
            return None
        if v is None:
            return None
        k = self.kind
        if k == "text":
            if not isinstance(v, str):
                fail(f"{self.api} must be text")
            if len(v) > self.maxlen:
                fail(f"{self.api} is too long")
            if self.required and not v.strip():
                fail(f"{self.api} is required")
        elif k == "int":
            if isinstance(v, bool) or not isinstance(v, (int, float)) or v != int(v):
                fail(f"{self.api} must be a whole number")
            v = int(v)
        elif k == "num":
            if isinstance(v, bool) or not isinstance(v, (int, float)) or v != v or v in (float("inf"), float("-inf")):
                fail(f"{self.api} must be a number")
            v = float(v)
        elif k == "date":
            if not isinstance(v, str):
                fail(f"{self.api} must be a date (YYYY-MM-DD)")
            try:
                v = dt.date.fromisoformat(v[:10])
            except ValueError:
                fail(f"{self.api} must be a date (YYYY-MM-DD)")
        elif k == "uuid":
            if not isinstance(v, str):
                fail(f"{self.api} must be an id")
            try:
                v = str(uuid.UUID(v))
            except ValueError:
                fail(f"{self.api} must be an id")
        elif k == "textarr":
            if not isinstance(v, list) or len(v) > 200 or not all(isinstance(x, str) and len(x) <= 2000 for x in v):
                fail(f"{self.api} must be a list of text")
        elif k == "json":
            if not isinstance(v, (dict, list)):
                fail(f"{self.api} must be an object or list")
        else:
            raise ValueError(k)
        if self.choices is not None and v not in self.choices:
            fail(f"{self.api} must be one of: {', '.join(map(str, self.choices))}")
        if self.lo is not None and v < self.lo or self.hi is not None and v > self.hi:
            fail(f"{self.api} must be between {self.lo} and {self.hi}")
        return v


def parse_fields(fields, data) -> dict:
    """column -> validated value, for every field."""
    if not isinstance(data, dict):
        fail("the request body must be a JSON object")
    out = {}
    for f in fields:
        v = f.parse(data)
        if f.kind == "json" and v is not None:
            v = Jsonb(v)  # psycopg needs jsonb values wrapped
        out[f.col] = v
    return out


def clamp(v, lo, hi):
    return max(lo, min(hi, v))
