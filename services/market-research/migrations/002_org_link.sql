-- Soft link: competitors → organisations registry.
-- Nullable. Existing rows are unaffected.
ALTER TABLE competitors
    ADD COLUMN organisation_id UUID
        REFERENCES organisations(id)
        ON DELETE SET NULL;
