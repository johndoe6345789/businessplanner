-- Migration: 002_startup_profile
-- Domain: organisations
-- Adds startup-specific fields for compound
-- progression modelling.

ALTER TABLE organisations
    ADD COLUMN initial_investment_gbp INTEGER
        NOT NULL DEFAULT 0,
    ADD COLUMN weeks_to_bootstrap INTEGER
        NOT NULL DEFAULT 0,
    ADD COLUMN monthly_revenue_gbp INTEGER
        NOT NULL DEFAULT 0,
    ADD COLUMN parent_org_id UUID
        REFERENCES organisations(id)
        ON DELETE SET NULL;

CREATE TABLE startup_steps (
    id               UUID PRIMARY KEY
                         DEFAULT gen_random_uuid(),
    organisation_id  UUID NOT NULL
        REFERENCES organisations(id)
        ON DELETE CASCADE,
    step_number      INTEGER NOT NULL,
    title            TEXT NOT NULL,
    description      TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL
                         DEFAULT NOW(),
    UNIQUE (organisation_id, step_number)
);

CREATE INDEX idx_startup_steps_org
    ON startup_steps (organisation_id);
