-- Migration: organisations domain
-- Central registry of external companies and
-- organisations referenced across the app.
CREATE TABLE organisations (
    id           UUID PRIMARY KEY
                 DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL
                 REFERENCES users(id)
                 ON DELETE CASCADE,
    name         TEXT NOT NULL,
    website      TEXT NOT NULL DEFAULT '',
    description  TEXT NOT NULL DEFAULT '',
    entity_types TEXT[] NOT NULL DEFAULT '{}',
    tags         TEXT[] NOT NULL DEFAULT '{}',
    notes        TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_org_user
    ON organisations(user_id);
CREATE INDEX idx_org_name
    ON organisations USING gin(
        to_tsvector('english', name));
