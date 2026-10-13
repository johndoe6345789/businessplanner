"""The application assembles: every route registers, none collide, and the public contract paths exist."""
from app.main import app

ROUTES = {(m, r.path) for r in app.routes if hasattr(r, "methods") for m in r.methods}


def test_every_frontend_route_exists():
    expected = [
        ("GET", "/api/risk-assessment"), ("POST", "/api/risk-assessment"), ("PUT", "/api/risk-assessment/{rid}"), ("DELETE", "/api/risk-assessment/{rid}"),
        ("GET", "/api/decisions"), ("POST", "/api/decisions"), ("PUT", "/api/decisions/{rid}"), ("DELETE", "/api/decisions/{rid}"),
        ("GET", "/api/scoping/features"), ("PUT", "/api/scoping/features/{rid}"), ("GET", "/api/pivots"), ("PUT", "/api/pivots/{rid}"),
        ("GET", "/api/reviews"), ("GET", "/api/reviews/this-week"), ("POST", "/api/reviews"),
        ("GET", "/api/kpi/metrics"), ("POST", "/api/kpi/metrics"), ("PUT", "/api/kpi/metrics/{rid}/value"), ("DELETE", "/api/kpi/metrics/{rid}"),
        ("GET", "/api/okr/objectives"), ("POST", "/api/okr/objectives"), ("DELETE", "/api/okr/objectives/{rid}"),
        ("POST", "/api/okr/objectives/{rid}/key-results"), ("PUT", "/api/okr/key-results/{rid}/value"), ("DELETE", "/api/okr/key-results/{rid}"),
        ("GET", "/api/pdca/cycles"), ("POST", "/api/pdca/cycles"), ("PUT", "/api/pdca/cycles/{rid}/phase"), ("DELETE", "/api/pdca/cycles/{rid}"),
        ("GET", "/api/hoshin/objectives"), ("POST", "/api/hoshin/objectives"), ("DELETE", "/api/hoshin/objectives/{rid}"),
        ("GET", "/api/hoshin/links"), ("POST", "/api/hoshin/links"), ("DELETE", "/api/hoshin/links/{rid}"),
        ("GET", "/api/hoshin/bowling"), ("POST", "/api/hoshin/bowling"), ("DELETE", "/api/hoshin/bowling/{rid}"), ("PUT", "/api/hoshin/bowling/{rid}/months"),
        ("GET", "/api/market-research/tam"), ("PUT", "/api/market-research/tam"), ("GET", "/api/market-research/bmc"), ("PUT", "/api/market-research/bmc"),
        ("GET", "/api/market-research/competitors"), ("PUT", "/api/market-research/competitors/{rid}"),
        ("GET", "/api/market-research/personas"), ("PUT", "/api/market-research/personas/{rid}"),
        ("GET", "/api/market-research/discovery"), ("POST", "/api/market-research/discovery"), ("DELETE", "/api/market-research/discovery/{rid}"),
        ("GET", "/api/financials/burn"), ("PUT", "/api/financials/burn"), ("GET", "/api/financials/unit-econ"), ("PUT", "/api/financials/unit-econ"),
        ("GET", "/api/financials/pricing"), ("PUT", "/api/financials/pricing"), ("GET", "/api/financials/kill-criteria"), ("PUT", "/api/financials/kill-criteria"),
        ("GET", "/api/financials/hypotheses"), ("POST", "/api/financials/hypotheses"), ("PUT", "/api/financials/hypotheses/{rid}"), ("DELETE", "/api/financials/hypotheses/{rid}"),
        ("GET", "/api/accelerators"), ("PUT", "/api/accelerators/{rid}"), ("GET", "/api/organisations"), ("PUT", "/api/organisations/{rid}"), ("GET", "/api/organisations/{rid}/steps"),
        ("GET", "/api/startup-types"), ("GET", "/api/startup-types/{slug}"), ("POST", "/api/legal/equity/split"), ("POST", "/api/legal/equity/vesting"),
        ("GET", "/healthz"),
    ]
    missing = [e for e in expected if e not in ROUTES]
    assert not missing, missing


def test_no_duplicate_routes():
    seen = [(m, r.path) for r in app.routes if hasattr(r, "methods") for m in r.methods]
    assert len(seen) == len(set(seen))


def test_every_data_route_requires_a_login():
    from fastapi.testclient import TestClient
    import httpx  # noqa: F401  (TestClient needs it)
    c = TestClient(app, raise_server_exceptions=False)
    for method, path in sorted(ROUTES):
        if path in ("/healthz",) or not path.startswith("/api/"):
            continue
        r = c.request(method, path.replace("{rid}", "3a3e243b-e335-0285-7caf-f925e16f0548").replace("{slug}", "saas"))
        assert r.status_code == 401, (method, path, r.status_code)
