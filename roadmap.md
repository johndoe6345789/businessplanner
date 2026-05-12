# ROADMAP — LaunchPad

> **Built on the [next_extra_primary](https://github.com/next_extra_primary)
> template.** The template supplies the backend, SSO, infra, and
> 25+ service domains. This roadmap tracks only what LaunchPad
> — a guided startup planner — actually needs to surface to its
> users. Template features that don't serve the product are
> noted but not scheduled.

---

## How to use this playbook

**This file is operational, not aspirational.**

**Start of every session:**
1. Read §6 (Current progress) for what's on disk.
2. Find the next pending item in §4 (Phased roadmap).
3. Check §7 (Open questions) before coding anything that
   touches an unanswered question.

**End of every session:**
1. Update §6 with files that landed.
2. Append any design decisions to §5.
3. Resolve answered questions in §7.

---

## 1. What this product is

**LaunchPad** guides founders from idea to launch:

- Step-by-step startup **planner** with milestone tracking.
- **Skills profile** — what you bring to the table.
- **AI planning assistant** — Claude-powered suggestions.
- **Gamification** — streaks, XP, levels, badges tied to
  planning progress (motivation loop).
- **Community** — forum for founder Q&A, progress feed.
- **Plan export** — download your roadmap as a PDF.

Everything else in the template (ecommerce, video, gallery,
wiki, blog, live streaming, IMAP sync) is available
infrastructure but is **not planned for LaunchPad's UI**.

---

## 2. Infrastructure (from template — already running)

| Role         | Technology        | Status                       |
|--------------|-------------------|------------------------------|
| Database     | Postgres 16       | ✅ running                   |
| Cache        | Redis 7           | ✅ running                   |
| Search       | Elasticsearch 8   | ✅ running                   |
| Identity     | Keycloak 26       | ✅ running                   |
| Object store | MinIO             | ✅ running                   |
| Package repo | C++/Next.js       | ✅ running at `/repo`        |
| Message bus  | Kafka (KRaft)     | 🔧 stub only — no broker yet |

Kafka runs gracefully in stub mode. The product can ship
without a live broker; it becomes relevant when real-time
notification fan-out matters (Phase 3).

---

## 3. Completion key

| Symbol | Meaning                                     |
|--------|---------------------------------------------|
| ✅     | Backend + frontend + wired end-to-end       |
| 🔧 BE  | Backend done, no frontend page yet          |
| ⬜     | Not yet started                             |
| ❌     | Out of scope for LaunchPad                  |

---

## 4. Phased roadmap

### Phase 1 — Gamification loop (highest-impact gap)

The motivation loop is core to the product. Backend service
logic exists (`badges`, `leaderboards`, `levels`, `streaks`,
`xp`, `progress`) but has **no HTTP controllers and no
migrations** yet.

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 1.1 | Streaks: controllers + migration                  | ⬜     |
| 1.2 | XP + levels + progress: controllers + migrations  | ⬜     |
| 1.3 | Badges: controllers + migration                   | ⬜     |
| 1.4 | Frontend: streak counter, XP bar, level badge     | ⬜     |
| 1.5 | Frontend: badge cabinet page                      | ⬜     |
| 1.6 | Wire planner step completion → XP + streak events | ⬜     |
| 1.7 | Leaderboard: controllers + migration + page       | ⬜     |

### Phase 2 — Notifications

Founders need reminders to maintain streaks and alerts when
milestones unlock. Backend is fully implemented (controllers
+ migrations ✅).

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 2.1 | `/notifications` inbox page                       | ⬜     |
| 2.2 | Notification bell badge in Navbar (live count)    | ⬜     |
| 2.3 | Planner events → notification triggers            | ⬜     |
| 2.4 | Email digest (daily planner reminder)             | ⬜     |

### Phase 3 — Community

Founders helping founders. Backend (comments/forum, social)
is fully implemented with controllers + migrations ✅.

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 3.1 | `/community` forum page (boards + threads + posts)| ⬜     |
| 3.2 | Inline comments on planner milestones             | ⬜     |
| 3.3 | `/feed` — progress feed (follows + activity)      | ⬜     |
| 3.4 | Follow / unfollow other founders                  | ⬜     |

### Phase 4 — Plan export and AI enhancements

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 4.1 | Export plan as PDF (backend: pdf domain ✅)        | ⬜     |
| 4.2 | AI suggestions per planner step (prompt tuning)   | ⬜     |
| 4.3 | Save AI chat threads to planner steps             | ⬜     |

### Phase 5 — Ops and quality

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 5.1 | Impersonation hardening (DB-backed session)       | ⬜     |
| 5.2 | `CookieAuthFilter` reject refresh tokens for API  | ⬜     |
| 5.3 | `usePlannerProgress.ts` threshold tuning (TODO:30)| ⬜     |
| 5.4 | Admin analytics dashboard                         | ⬜     |
| 5.5 | CSP + security headers middleware                 | ⬜     |
| 5.6 | Frontend test coverage: 60% of organisms          | ⬜     |
| 5.7 | Backend GTest: badges, leaderboards, streaks, xp  | ⬜     |
| 5.8 | Playwright suites for each new page above         | ⬜     |

### Cross-cutting

| ID  | Item                                                |
|-----|-----------------------------------------------------|
| X1  | Real-time WebSocket bus (chat + streak alerts + feed)|
| X2  | Feature flags for gradual rollout of community      |

---

## 5. Design decisions

| #   | Decision                                                    |
|-----|-------------------------------------------------------------|
| D1  | Gamification events triggered by planner step completion,  |
|     | not arbitrary actions — keeps motivation tied to product   |
| D2  | Forum is founder Q&A only (no off-topic boards v1)         |
| D3  | PDF export uses template's Gotenberg sidecar               |
| D4  | Leaderboard is opt-in (founders can hide from ranking)     |
| D5  | Package repo auth = self-contained JWT (not Keycloak SSO)  |
| D6  | Package repo blob store = MinIO (`packagerepo` bucket)     |

---

## 6. Current progress

### ✅ Shipped end-to-end

- Auth: email/password, JWT, Keycloak OIDC, passkeys,
  TOTP, OAuth (Google/GitHub)
- Planner: startup roadmap with step toggle + Redux
- Profile: skills form with localStorage
- Search: full-text via Elasticsearch
- Dashboard: draggable widget grid
- Settings: theme, prefs, API keys, admin controls
- Admin: live translation editor, debug panel
- PWA: manifest, service worker, install prompt
- i18n: 8 locales

### 🔧 Backend done, no frontend page yet

| Domain        | Notes                                  |
|---------------|----------------------------------------|
| gamification  | Service logic only — no controllers    |
| notifications | Full backend ✅ — no inbox page        |
| forum         | Full backend ✅ — no `/community` page |
| social        | Full backend ✅ — no `/feed` page      |
| pdf           | Full backend ✅ — no export trigger UI |
| ai-chat       | Full backend ✅ — chat UI exists but   |
|               | not yet linked to planner steps        |

### ❌ Out of scope for LaunchPad

These template backends exist and run but will not be
surfaced in LaunchPad's UI:

- `blog` — not a blogging platform
- `gallery` — no photo albums
- `ecommerce` — no storefront
- `video` / `streaming` — no media platform
- `wiki` — no knowledge base
- `imap-sync` — no email inbox

---

## 7. Open questions

| #  | Question                                               | Default          |
|----|--------------------------------------------------------|------------------|
| Q1 | Leaderboard: opt-in ranking or always visible?         | Opt-in (D4)      |
| Q2 | Community v1: forum only, or also DMs?                 | Forum only       |
| Q3 | PDF export: full plan only, or per-section too?        | Full plan first  |
| Q4 | AI suggestions: on-demand button or auto-generated?    | On-demand        |
| Q5 | Planner steps: locked until previous done, or free?    | Free (any order) |
