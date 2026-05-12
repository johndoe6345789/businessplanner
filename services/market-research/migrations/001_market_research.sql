-- Migration: market-research domain
-- TODO (v2): add startup_id FK to all tables once
--            the startup entity (D23) is implemented.

-- TAM inputs (one row per user, upserted)
CREATE TABLE tam_inputs (
    user_id   UUID PRIMARY KEY
              REFERENCES users(id) ON DELETE CASCADE,
    total_market_usd    BIGINT NOT NULL DEFAULT 0,
    target_segment_pct  NUMERIC(5,2) NOT NULL DEFAULT 0,
    reachable_pct       NUMERIC(5,2) NOT NULL DEFAULT 0,
    notes               TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Competitors
CREATE TABLE competitors (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL
                REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    website     TEXT NOT NULL DEFAULT '',
    stage       TEXT NOT NULL DEFAULT '',
    strengths   TEXT[] NOT NULL DEFAULT '{}',
    weaknesses  TEXT[] NOT NULL DEFAULT '{}',
    features    JSONB NOT NULL DEFAULT '{}',
    notes       TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_competitors_user
    ON competitors(user_id);

-- Customer personas
CREATE TABLE personas (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL
                REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    pain_points TEXT[] NOT NULL DEFAULT '{}',
    goals       TEXT[] NOT NULL DEFAULT '{}',
    channels    TEXT[] NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_personas_user ON personas(user_id);

-- Discovery interview log
CREATE TABLE discovery_entries (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL
                  REFERENCES users(id) ON DELETE CASCADE,
    contact_name  TEXT NOT NULL,
    contact_role  TEXT NOT NULL DEFAULT '',
    interview_date DATE NOT NULL DEFAULT CURRENT_DATE,
    key_findings  TEXT NOT NULL DEFAULT '',
    verbatim_quote TEXT NOT NULL DEFAULT '',
    validated_assumptions   TEXT[] NOT NULL DEFAULT '{}',
    invalidated_assumptions TEXT[] NOT NULL DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_discovery_user
    ON discovery_entries(user_id);

-- Business Model Canvas (one row per user, upserted)
CREATE TABLE bmc_canvas (
    user_id           UUID PRIMARY KEY
                      REFERENCES users(id) ON DELETE CASCADE,
    problem           TEXT NOT NULL DEFAULT '',
    solution          TEXT NOT NULL DEFAULT '',
    uvp               TEXT NOT NULL DEFAULT '',
    channels          TEXT NOT NULL DEFAULT '',
    customer_segments TEXT NOT NULL DEFAULT '',
    cost_structure    TEXT NOT NULL DEFAULT '',
    revenue_streams   TEXT NOT NULL DEFAULT '',
    key_metrics       TEXT NOT NULL DEFAULT '',
    unfair_advantage  TEXT NOT NULL DEFAULT '',
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
