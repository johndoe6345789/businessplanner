import datetime as dt

import pytest

from app.core import ApiError, F, as_uuid, conv, parse_fields


def parse(field, data):
    return field.parse(data)


def test_required_text():
    f = F("title", required=True)
    assert parse(f, {"title": "x"}) == "x"
    for bad in ({}, {"title": ""}, {"title": "   "}, {"title": 3}):
        with pytest.raises(ApiError) as e:
            parse(f, bad)
        assert e.value.status == 400


def test_defaults_and_nullable():
    assert parse(F("notes", default=""), {}) == ""
    assert parse(F("notes", default=""), {"notes": None}) == ""
    assert parse(F("when", kind="date", nullable=True), {"when": None}) is None
    assert parse(F("when", kind="date", nullable=True), {"when": ""}) is None
    assert parse(F("when", kind="date", nullable=True), {}) is None


def test_int_rules():
    f = F("n", kind="int", required=True, lo=1, hi=5)
    assert parse(f, {"n": 3}) == 3 and parse(f, {"n": 3.0}) == 3
    for bad in (0, 6, 2.5, "3", True, None):
        with pytest.raises(ApiError):
            parse(f, {"n": bad})


def test_numbers_reject_nan_and_inf():
    f = F("x", kind="num", required=True)
    assert parse(f, {"x": 2}) == 2.0
    for bad in (float("nan"), float("inf"), "1", True):
        with pytest.raises(ApiError):
            parse(f, {"x": bad})


def test_dates_and_ids():
    assert parse(F("d", kind="date", required=True), {"d": "2026-10-12"}) == dt.date(2026, 10, 12)
    assert parse(F("d", kind="date", required=True), {"d": "2026-10-12T10:00:00Z"}) == dt.date(2026, 10, 12)
    with pytest.raises(ApiError):
        parse(F("d", kind="date", required=True), {"d": "next tuesday"})
    u = "3a3e243b-e335-0285-7caf-f925e16f0548"
    assert parse(F("u", kind="uuid", required=True), {"u": u}) == u
    with pytest.raises(ApiError):
        parse(F("u", kind="uuid", required=True), {"u": "nope"})
    with pytest.raises(ApiError) as e:
        as_uuid("nope")
    assert e.value.status == 404


def test_lists_and_choices():
    f = F("tags", kind="textarr", default=[])
    assert parse(f, {"tags": ["a", "b"]}) == ["a", "b"]
    for bad in ("a", [1], ["a"] * 201):
        with pytest.raises(ApiError):
            parse(f, {"tags": bad})
    c = F("status", choices=["open", "closed"], default="open")
    assert parse(c, {}) == "open" and parse(c, {"status": "closed"}) == "closed"
    with pytest.raises(ApiError):
        parse(c, {"status": "weird"})


def test_text_length_cap():
    with pytest.raises(ApiError):
        parse(F("t", maxlen=5), {"t": "123456"})


def test_parse_fields_maps_api_names_to_columns_and_wraps_json():
    vals = parse_fields([F("title", "name", required=True), F("features", kind="json", default={})], {"title": "T"})
    assert list(vals) == ["name", "features"] and vals["name"] == "T"
    assert type(vals["features"]).__name__ == "Jsonb"
    with pytest.raises(ApiError):
        parse_fields([F("a")], ["not", "an", "object"])


def test_conv():
    import decimal
    assert conv(decimal.Decimal("5.00")) == 5 and isinstance(conv(decimal.Decimal("5.00")), int)
    assert conv(decimal.Decimal("5.25")) == 5.25
    assert conv(dt.date(2026, 10, 12)) == "2026-10-12"
    assert conv({"a": [decimal.Decimal(1)]}) == {"a": [1]}
