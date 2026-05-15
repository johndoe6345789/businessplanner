-- Migration: 002_org_link
-- Domain: risk-assessment
-- Adds nullable FK to organisations for
-- per-company risk comparison.

ALTER TABLE risks
    ADD COLUMN organisation_id UUID
        REFERENCES organisations(id)
        ON DELETE SET NULL;

CREATE INDEX idx_risks_organisation_id
    ON risks (organisation_id)
    WHERE organisation_id IS NOT NULL;
