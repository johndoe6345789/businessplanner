-- Migration: accelerators domain
CREATE TABLE accelerator_programmes (
    id          UUID PRIMARY KEY
                DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,
    name        TEXT NOT NULL,
    programme_type TEXT NOT NULL
                DEFAULT 'accelerator'
                CHECK (programme_type IN (
                    'accelerator','competition',
                    'grant','fellowship')),
    website     TEXT NOT NULL DEFAULT '',
    deadline    DATE,
    status      TEXT NOT NULL DEFAULT 'researching'
                CHECK (status IN (
                    'researching','applying',
                    'applied','interviewing',
                    'accepted','rejected','passed')),
    notes       TEXT NOT NULL DEFAULT '',
    equity_pct  NUMERIC(5,2),
    funding_gbp NUMERIC(12,2),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_acc_user
    ON accelerator_programmes(
        user_id, deadline ASC NULLS LAST);
