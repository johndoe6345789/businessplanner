-- 002_email_compose_drafts.sql
-- Adds SMTP config + draft/reply/bcc/dedup columns
-- for the C++ email domain (Flask parity).
ALTER TABLE email_accounts
    ADD COLUMN IF NOT EXISTS imap_encryption VARCHAR(16) DEFAULT 'tls',
    ADD COLUMN IF NOT EXISTS smtp_host       VARCHAR(255),
    ADD COLUMN IF NOT EXISTS smtp_port       INTEGER DEFAULT 587,
    ADD COLUMN IF NOT EXISTS smtp_encryption VARCHAR(16) DEFAULT 'tls',
    ADD COLUMN IF NOT EXISTS smtp_user       VARCHAR(255),
    ADD COLUMN IF NOT EXISTS smtp_pass       VARCHAR(512);
ALTER TABLE email_messages
    ADD COLUMN IF NOT EXISTS message_id   VARCHAR(512),
    ADD COLUMN IF NOT EXISTS bcc_addrs    TEXT,
    ADD COLUMN IF NOT EXISTS reply_to     VARCHAR(512),
    ADD COLUMN IF NOT EXISTS is_draft     BOOLEAN DEFAULT FALSE;
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_messages_message_id
    ON email_messages(message_id) WHERE message_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_email_messages_draft
    ON email_messages(account_id, is_draft);
