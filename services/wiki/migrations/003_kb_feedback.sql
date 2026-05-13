-- 003_kb_feedback.sql
-- Thumbs-up / thumbs-down votes on KB articles.

CREATE TABLE IF NOT EXISTS kb_feedback (
    id         UUID        PRIMARY KEY
                           DEFAULT gen_random_uuid(),
    page_id    BIGINT      NOT NULL,
    user_id    UUID        NOT NULL
                           REFERENCES users(id)
                           ON DELETE CASCADE,
    helpful    BOOLEAN     NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (page_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_kb_feedback_page
    ON kb_feedback (page_id);
