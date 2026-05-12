-- 002_kb_metadata.sql
-- Extend wiki_pages to carry LaunchPad knowledge-base
-- metadata. The wiki backend now doubles as the KB CMS:
-- same table, same revision history, same admin editor.
--
-- Slug convention for KB content:
--   {startup_type}.{kb_type}.{stage}.{page-slug}
--   e.g. saas.playbooks.validate.finding-first-customers
--
-- Pages without kb_type are treated as general wiki
-- pages and are not surfaced in the /knowledge route.

ALTER TABLE wiki_pages
    ADD COLUMN IF NOT EXISTS kb_type TEXT
        CHECK (kb_type IN (
            'guide', 'playbook', 'benchmark',
            'legal', 'template', 'checklist'
        )),
    ADD COLUMN IF NOT EXISTS startup_type TEXT,
    ADD COLUMN IF NOT EXISTS stage TEXT,
    ADD COLUMN IF NOT EXISTS tags TEXT[]
        NOT NULL DEFAULT '{}';

-- Index startup_type + kb_type for the /knowledge
-- listing queries (filter by type and stage).
CREATE INDEX IF NOT EXISTS idx_wiki_kb_type
    ON wiki_pages (kb_type)
    WHERE kb_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wiki_startup_type
    ON wiki_pages (startup_type)
    WHERE startup_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wiki_stage
    ON wiki_pages (stage)
    WHERE stage IS NOT NULL;

-- GIN index on tags for array containment queries
-- e.g. WHERE tags @> '{gtm, saas}'.
CREATE INDEX IF NOT EXISTS idx_wiki_tags
    ON wiki_pages USING GIN (tags);
