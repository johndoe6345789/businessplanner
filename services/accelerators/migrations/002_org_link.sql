-- Soft link: accelerator_programmes →
-- organisations registry.
-- Nullable; existing rows are unaffected.
ALTER TABLE accelerator_programmes
    ADD COLUMN organisation_id UUID
        REFERENCES organisations(id)
        ON DELETE SET NULL;
