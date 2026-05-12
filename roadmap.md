# ROADMAP — LaunchPad

> **Built on the [next_extra_primary](https://github.com/next_extra_primary)
> template.** That template provides the batteries-included
> backend, SSO, package repo, and infra stack. This repo
> (businessplanner / LaunchPad) is a consumer of it — the
> product roadmap below tracks what *this product* needs to
> build on top of that foundation.
>
> **Every character is a feature.** Nothing gets deleted.
> Features get finished, not stripped.

---

## How to use this playbook

**This file is operational, not aspirational.**

**Start of every session:**
1. Read §8 (Current progress) for what's on disk.
2. Find the next pending item in §5 (Phased roadmap).
3. Check §9 (Open questions) before coding any step
   that touches an unanswered question.

**End of every session:**
1. Update §8 with files that landed.
2. Append any design decisions to §6.
3. Resolve answered questions in §9.

**What lives where:**
- **roadmap.md** — plan: what, why, in what order.
- **CLAUDE.md** — coding conventions for every change.

---

## 1. What this project is

LaunchPad is a **guided startup planner** — the product
being built in `frontend/` on top of the `next_extra_primary`
infrastructure template.

The template contributes (already running locally):

- **Drogon C++20 backend** — auth (JWT + passkeys + TOTP +
  OAuth), gamification, AI chat, comments, email, admin,
  webhooks, ecommerce, social, and 25+ more service domains.
- **Postgres 16** via Drogon ORM, per-domain migrations.
- **Next.js 16 frontend scaffold** (App Router, TS strict,
  MUI v6, next-intl 8 locales, RTK Query, shared M3 library).
- **Package repository** at `/repo` — C++/Next.js artifact
  registry with 15 protocol adapters.
- **Nginx portal on :8892** — 15 Docker services,
  fully orchestrated and health-checked.

The LaunchPad product adds on top of that:

- Guided startup roadmap (planner) with step-by-step
  milestones from idea to launch.
- Skills / qualifications profile builder.
- AI-assisted planning via the built-in chat integration.
- Progress tracking with gamification (points, levels,
  streaks, badges).
- Community features: forum, social feed, challenges.

---

## 2. Confirmed infrastructure stack

| Role         | Technology        | Status in compose           |
|--------------|-------------------|-----------------------------|
| Database     | Postgres 16       | ✅ `db` + `keycloak-db` + `pkgrepo-db` |
| Cache        | Redis 7           | ✅ running                  |
| Search       | Elasticsearch 8   | ✅ running                  |
| Message bus  | Kafka (KRaft)     | 🔧 stub client only — no broker yet |
| Identity     | Keycloak 26       | ✅ running                  |
| Object store | MinIO             | ✅ running (for pkgrepo)    |
| Package repo | C++/Next.js       | ✅ running at `/repo`       |

**Transport rules (locked):**
- Durable work queue → Postgres `SKIP LOCKED` (not Kafka).
- Cross-domain events (audit, notifications, search, webhooks)
  → Kafka topics.
- Ephemeral state (sessions, rate-limit, presence) → Redis.
- Source-of-truth relational → Postgres.

---

## 3. Architecture patterns

### Composition rule
Every service must compose with ≥ 2 existing batteries or it
doesn't belong in the template. This is the primary filter.

### Job scheduler is the backbone
`services/cron/` defines the job queue. All daemons route
their background work through it:

| Domain         | Background work via jobs            |
|----------------|-------------------------------------|
| audit          | partition prune, s3 archive         |
| search         | reindex (hourly)                    |
| backup         | daily Postgres + MinIO snapshot     |
| notifications  | digest, retry failed deliveries     |
| video          | per-upload transcode                |
| image          | per-upload resize/EXIF strip        |
| webhooks       | retry with exponential backoff      |
| blog           | scheduled publish / unpublish       |
| ecommerce      | abandoned-cart email, stock alerts  |

---

## 4. Completion key

| Symbol | Meaning                                    |
|--------|--------------------------------------------|
| ✅     | Backend + frontend + wired end-to-end      |
| 🔧 BE  | Backend implemented, no frontend yet       |
| 🔧 FE  | Frontend exists, backend stub/missing      |
| ⬜     | Designed but no code                       |
| ❌     | Explicitly descoped                        |

---

## 5. Phased roadmap

### Phase 0 — Infrastructure

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 0.1 | Redis in compose + Drogon client                  | ✅     |
| 0.2 | Elasticsearch in compose + Drogon client          | ✅     |
| 0.3 | Kafka (KRaft) broker in compose                   | ⬜     |
| 0.4 | Replace KafkaClientStub with live producer/consumer| ⬜     |
| 0.5 | Kafka topics constants JSON + healthz check       | ⬜     |

Kafka runs in graceful stub mode today — all domains that
publish events compile and run, but events are no-ops.
Adding the real broker (0.3) unlocks audit, notification
fan-out, search reindex, and webhook dispatch.

### Phase 1 — Gamification front-end

All gamification backend service logic exists
(`badges`, `leaderboards`, `levels`, `streaks`, `xp`,
`progress`) but has **zero HTTP controllers and zero
migrations**. Before frontend can wire these, the backend
needs:

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 1.1 | Badges controllers + migration                    | ⬜     |
| 1.2 | Leaderboards controllers + migration              | ⬜     |
| 1.3 | Levels + XP + progress controllers + migrations   | ⬜     |
| 1.4 | Streaks controllers + migration                   | ⬜     |
| 1.5 | Frontend: badges, level, XP, streak display pages | ⬜     |
| 1.6 | Frontend: leaderboard page                        | ⬜     |

### Phase 2 — Job scheduler completion

9 of ~16 files landed. Remaining to make it buildable:

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 2.1 | `JobQueue.cpp` — SQL enqueue/claim/complete/fail  | ⬜     |
| 2.2 | `JobWorker.h/.cpp` — worker loop                  | ⬜     |
| 2.3 | `JobCron.h/.cpp` — cron expression + next-run     | ⬜     |
| 2.4 | `JobScheduler.cpp` — lifecycle (workers + cron)   | ⬜     |
| 2.5 | `JobController.h/.cpp` — REST API                 | ⬜     |
| 2.6 | `main.cpp` job-scheduler subcommand               | ⬜     |
| 2.7 | `services/job-scheduler/` compose service + UI    | ⬜     |

### Phase 3 — Content frontend pages

These backends are **fully implemented** with controllers and
migrations. They just need frontend pages:

| ID  | Domain         | What's missing                      |
|-----|----------------|-------------------------------------|
| 3.1 | comments       | `/forum` page (boards/threads/posts)|
| 3.2 | blog           | `/blog` listing + article pages     |
| 3.3 | wiki           | `/wiki` browse + edit pages         |
| 3.4 | gallery        | `/gallery` album + photo pages      |
| 3.5 | notifications  | `/notifications` inbox page         |
| 3.6 | social         | `/social` feed + DMs + groups pages |
| 3.7 | polls          | Inline poll widget for blog/forum   |

### Phase 4 — Commerce and live media frontend

| ID  | Domain         | What's missing                      |
|-----|----------------|-------------------------------------|
| 4.1 | ecommerce      | `/shop` product/cart/checkout pages |
| 4.2 | video          | `/video` browse + player pages      |
| 4.3 | streaming      | `/live` stream viewer + broadcaster |
| 4.4 | pdf            | Invoice/export download triggers    |

### Phase 5 — Ops and test coverage

| ID  | Item                                                | Status |
|-----|-----------------------------------------------------|--------|
| 5.1 | Kafka broker in compose (moves 0.3 to done)         | ⬜     |
| 5.2 | `imap-sync` controllers + migration                 | ⬜     |
| 5.3 | `user-profiles` / `user-stats` / `user-search` code | ⬜     |
| 5.4 | Frontend test coverage: target 60% of organisms     | ⬜     |
| 5.5 | Backend GTest for: badges, leaderboards, streaks, xp| ⬜     |
| 5.6 | Playwright JSON test suite for each new page above  | ⬜     |

### Phase 6 — Polish

| ID  | Item                                                | Status |
|-----|-----------------------------------------------------|--------|
| 6.1 | Impersonation hardening (DB-backed session + audit) | ⬜     |
| 6.2 | `CookieAuthFilter` reject refresh tokens for API    | ⬜     |
| 6.3 | `usePlannerProgress.ts` threshold tuning (TODO:30)  | ⬜     |
| 6.4 | Admin analytics dashboard (merges analytics domain) | ⬜     |
| 6.5 | Kubernetes Helm chart                               | ⬜     |

### Cross-cutting

| ID  | Item                                                |
|-----|-----------------------------------------------------|
| X1  | Unified WebSocket event bus (chat + presence + notif)|
| X2  | Redis caching layer (leaderboard, session, rate-limit)|
| X3  | CSP + security headers middleware                   |
| X4  | Health-check contract every domain implements       |

---

## 6. Design decisions log

| #   | Decision                                                    |
|-----|-------------------------------------------------------------|
| D0  | Stack = Postgres + Redis + Kafka + Elasticsearch + Keycloak + MinIO |
| D1  | Job scheduler = Postgres SKIP LOCKED (not Kafka)            |
| D2  | Audit transport = Kafka topic `audit.events`                |
| D3  | Audit daemon INSERT-only DB user                            |
| D4  | Audit tamper-evidence = hash chain + daily Merkle root      |
| D5  | Audit retention = partition-by-month, configurable days     |
| D6  | Old audit partitions archived to MinIO before drop          |
| D7  | Impersonation = DB-backed session table, full audit trail   |
| D8  | Live streaming = Drogon control + mediamtx sidecar          |
| D9  | Video reencoding = Drogon supervises ffmpeg child procs     |
| D10 | Search = Drogon wraps Elasticsearch                         |
| D11 | PDF = Gotenberg sidecar                                     |
| D12 | Comments = polymorphic (`resource_type` + `resource_id`);   |
|     | forum boards/threads/posts use the same table               |
| D13 | Polls handles votes (up/down) AND polls in one schema       |
| D14 | All background work routes through job scheduler            |
| D15 | Notification router: one API, pluggable channel backends    |
| D16 | Feature flags = key/value + JSON targeting rules            |
| D17 | Rate limiter = Redis token bucket                           |
| D18 | Package repo auth = self-contained JWT (not Keycloak SSO)   |
| D19 | Package repo blob store = MinIO (`packagerepo` bucket)      |

---

## 7. Open questions

| #   | Question                                               | Default           |
|-----|--------------------------------------------------------|-------------------|
| Q1  | Audit retention default: 30 / 90 / 365 days?           | 365               |
| Q2  | Passkeys + 2FA: both required or user-choice?          | User-choice, ≥1   |
| Q3  | Ecommerce: multi-vendor or single-seller?              | Single-seller     |
| Q4  | Blog comments: auto-approve / manual / reputation?     | Auto, reportable  |
| Q5  | Livestream recording retention                         | 90 days, opt-in   |
| Q6  | Feature flag client SDK: server-only or browser too?   | Both              |
| Q7  | Forum moderation: flag-only or active removal queue?   | Flag-only v1      |

---

## 8. Current progress

### ✅ Fully shipped (backend + frontend end-to-end)

- Auth: email/password, JWT refresh, reset, Keycloak OIDC,
  passkeys (WebAuthn), TOTP, OAuth (Google/GitHub)
- Planner: startup roadmap with step toggle + Redux persistence
- Profile: skills form with localStorage backing
- Search: full-text via Elasticsearch + dedicated UI page
- Dashboard: draggable widget grid (DND-kit)
- Settings: theme, user prefs, API keys, admin controls
- Translations: live admin editor at `/admin/translations`
- PWA: manifest, service worker, install prompt
- i18n: 8 locales, all strings externalized
- Package repository: full C++ backend + Next.js UI at `/repo`
  with 15 protocol adapters (npm, pypi, conan, apt, cargo,
  helm, OCI/Docker and more)

### 🔧 Backend done, frontend missing

| Domain          | Backend state                      |
|-----------------|------------------------------------|
| comments/forum  | Controllers + migrations ✅        |
| blog            | Controllers + migrations ✅        |
| wiki            | Controllers + migrations ✅        |
| gallery         | Controllers + migrations ✅        |
| notifications   | Controllers + migrations ✅        |
| social          | Controllers + migrations ✅        |
| polls           | Controllers + migrations ✅        |
| ecommerce       | Controllers + migrations + Stripe ✅|
| video           | Controllers + migrations ✅        |
| streaming       | Controllers + migrations ✅        |
| webhooks        | Controllers + migrations ✅        |
| feature-flags   | Controllers + migrations ✅        |
| backup          | Controllers + migrations ✅        |
| pdf             | Controllers + migrations ✅        |
| status-page     | Controllers + migrations ✅        |
| analytics       | Controllers + migrations ✅        |
| ai-chat         | Controllers + migrations ✅        |
| alerts          | Controllers + migrations ✅        |
| audit           | Controllers + migrations ✅        |
| api-keys        | Controllers + migrations ✅        |

### ⬜ Backend service logic exists, no HTTP layer yet

| Domain       | Exists                    | Missing              |
|--------------|---------------------------|----------------------|
| badges       | BadgeService, BadgeInserter| Controllers + migration|
| leaderboards | LeaderboardService        | Controllers + migration|
| levels       | LevelService              | Controllers + migration|
| streaks      | StreakService             | Controllers + migration|
| xp           | XpService                 | Controllers + migration|
| progress     | ProgressService           | Controllers + migration|
| imap-sync    | Sync logic                | Controllers + migration|

### ⬜ README stubs only (no code)

`user-profiles`, `user-stats`, `user-search`, `user-lookup`

### 🔧 Job scheduler (Phase 2)

9 of ~16 files on disk. Remaining: `JobQueue.cpp`,
`JobWorker`, `JobCron`, `JobScheduler.cpp`,
`JobController`, main.cpp subcommand, compose service.

### Infrastructure notes

- Kafka runs as **KafkaClientStub** — all publishers compile
  and run cleanly; events are intentional no-ops until a real
  broker is added.
- Stripe runs as **StripeClientStub** when no API key is set —
  returns `pi_stub` PaymentIntent.
- libvips: `VipsProcessor` stubs gracefully without the lib.
- Kafka broker: not yet in `docker-compose.yml` (Phase 0.3).

---

## 9. Session order (next up)

1. **Phase 1** — gamification backend controllers + migrations,
   then frontend pages (badges/levels/XP/leaderboard).
2. **Phase 2** — job scheduler completion (remaining 7 files).
3. **Phase 3** — content frontend pages (forum, blog, wiki,
   gallery, notifications, social) — backends already exist.
4. **Phase 0.3/0.4** — Kafka real broker once event fan-out
   is needed (after notifications and audit UIs land).
5. **Phase 4** — commerce and live media frontend.
6. **Phase 5** — test coverage and imap-sync / user-* domains.
7. **Phase 6** — polish, security hardening, Helm chart.
