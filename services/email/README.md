# email

SMTP/IMAP email service, templates, and webmail UI.
The mail backend is now a C++ Drogon domain (the
former Flask `email-service` has been ported); the
Next.js webmail UI lives under `webmail/`.

## C++ API surface (`/api/email/...`)

All routes are served by `businessplanner-api` (Drogon) under
the `controllers` namespace.

| Method | Path                         | Auth |
|--------|------------------------------|------|
| POST   | `/api/email/compose`         | yes  |
| GET    | `/api/email/compose/drafts`  | yes  |
| POST   | `/api/email/compose/drafts`  | yes  |
| GET    | `/api/email/messages`        | yes  |
| GET    | `/api/email/messages/{id}`   | yes  |
| POST   | `/api/email/sync/{accountId}`| yes  |
| GET    | `/api/email/health`          | no   |
| GET    | `/api/email/version`         | no   |

(Plus `EmailAccountController` for account CRUD.)

### Compose / drafts

- `POST /api/email/compose` — body
  `{accountId(req),to,subject,body,bodyHtml?,cc?,
  bcc?,replyTo?}`. The account is loaded
  **owner-scoped** and the message is sent through
  **that account's own SMTP** server
  (host/port/user/pass/encryption from the
  `email_accounts` row; falls back to env SMTP
  host/port only when `smtp_host` is NULL).
  `From` = the account's address; recipients =
  `to` + `cc` + `bcc` (bcc is not a header).
  Adds `Date` and `Message-ID` headers. Encryption:
  `ssl` -> implicit TLS, `tls`/`starttls` ->
  STARTTLS, otherwise plain. Returns
  `{"sent":true,"to":..,"subject":..}`. SMTP errors
  return a generic 500 `"Send failed"` — the
  underlying SMTP/exception text is **never** sent
  to the client (the old Flask route leaked
  `Send failed: {e}`; the C++ port must not).
- `GET /api/email/compose/drafts` — drafts
  (`email_messages` with `is_draft = true`) joined
  to the caller's owned accounts.
- `POST /api/email/compose/drafts` — creates a draft
  on an owned account (`folder = 'Drafts'`,
  `is_draft = true`); `201` with the message JSON.

### Auth & scoping

- Compose/drafts/messages/accounts use the Drogon
  `filters::CookieAuthFilter`. `health` and
  `version` have **no filter** (unauthenticated,
  Flask-shaped JSON).
- Identity comes from
  `req->getAttributes()->get<std::string>("user_id")`.
  There is **no `X-Tenant-Id`** header anymore — the
  old Flask tenant header is gone; every account and
  message query is scoped to the owning `user_id`.
- Controllers contain no SQL; they delegate to
  `services::EmailComposeService` and
  `services::EmailDraftService`. The transactional
  `noreply@` sender (`services::EmailService`) is
  unchanged.

## NOTE — frontend / nginx follow-up

The webmail frontend
(`services/email/webmail/.../emailApiFetchers.ts`)
and the nginx reverse proxy still call the legacy
`/emailclient/api/...` paths that pointed at the
Flask `emailclient-api` container. That container is
no longer built (removed from `docker-bake.hcl`).
These callers must be repointed to `/api/email/...`
in a **follow-up change** — do not change the
frontend or nginx as part of this work package.
