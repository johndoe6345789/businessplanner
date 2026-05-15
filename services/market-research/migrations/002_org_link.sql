-- Soft link: competitors → organisations registry.
-- Nullable; existing rows are unaffected.
ALTER TABLE competitors
    ADD COLUMN organisation_id UUID
        REFERENCES organisations(id)
        ON DELETE SET NULL;
