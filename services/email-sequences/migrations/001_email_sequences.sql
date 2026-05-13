-- 001_email_sequences.sql
-- State machine for welcome drip, streak-at-risk,
-- and re-engagement emails.

CREATE TABLE IF NOT EXISTS email_sequence_state (
    user_id      UUID        PRIMARY KEY
                             REFERENCES users(id)
                             ON DELETE CASCADE,
    joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_sent_day INT        NOT NULL DEFAULT 0,
    reengagement_sent_at TIMESTAMPTZ,
    opted_out    BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_ess_opted_out
    ON email_sequence_state (opted_out)
    WHERE opted_out = FALSE;
