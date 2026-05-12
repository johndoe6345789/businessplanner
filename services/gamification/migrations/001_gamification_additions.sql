-- Phase 1 gamification additions
ALTER TABLE badges
    ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;

UPDATE badges
    SET slug = TRIM('_' FROM
        REGEXP_REPLACE(LOWER(name), '[^a-z0-9]+', '_', 'g'))
    WHERE slug IS NULL;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS leaderboard_opt_in
    BOOLEAN NOT NULL DEFAULT TRUE;
