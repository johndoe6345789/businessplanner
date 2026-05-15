-- Soft link: accelerator_programmes →
-- organisations registry.
-- Nullable. Existing rows are unaffected.
ALTER TABLE accelerator_programmes
    ADD COLUMN IF NOT EXISTS organisation_id UUID
        REFERENCES organisations(id)
        ON DELETE SET NULL;
