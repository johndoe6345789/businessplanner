-- GDPR request audit trail
CREATE TABLE gdpr_requests (
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID NOT NULL
               REFERENCES users(id) ON DELETE CASCADE,
    type       TEXT NOT NULL
               CHECK (type IN ('export', 'deletion')),
    status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN (
                   'pending', 'complete', 'failed'
               )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
CREATE INDEX idx_gdpr_requests_user
    ON gdpr_requests(user_id);
