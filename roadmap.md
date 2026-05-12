# ROADMAP — LaunchPad

> **Built on the [next_extra_primary](https://github.com/next_extra_primary)
> template.** The template supplies the backend, SSO, infra, and
> 25+ service domains. This roadmap tracks only what LaunchPad
> — a guided startup launcher — actually needs to surface to its
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

**LaunchPad** is a structured guide from idea to paying customers.

Most startups fail not because founders lack ideas but because
they don't know what to validate first, waste money on the
wrong path, and run out of runway before finding
product-market fit. LaunchPad fixes that.

**LaunchPad is simultaneously a knowledge base and an
interactive tool.** These are not the same thing and both
are required:

- A *knowledge base* tells you what a SaaS startup is,
  what its common failure modes are, what a typical CAC
  looks like, and what a go-to-market playbook contains.
  It is reference material you browse and search.

- An *interactive tool* takes your actual numbers, your
  market, your skills, and your current stage, and tells
  you what *you specifically* should do next. It computes
  live as you type. It surfaces gaps in your plan. It
  asks you questions and builds a personalised path.

The AI is the bridge: it reads the knowledge base context
for your startup type *and* your live inputs, then
synthesises both into advice that is grounded in curated
best practice and specific to your situation.

**Core capabilities:**

- **Startup type framework** — SaaS, marketplace,
  e-commerce, hardware, services, fintech, health, content,
  and platform startups all have different critical paths,
  cost curves, and failure modes. The planner is dynamic:
  steps, stage gates, and advice adapt to the founder's
  type.

- **Knowledge base** — curated guides per startup type,
  launch playbooks (go-to-market, fundraising, hiring),
  industry benchmarks (typical CAC/LTV/churn by type),
  common failure patterns, and stage-by-stage checklists.
  Fully indexed and searchable. Admin-maintained, not
  user-generated.

- **Interactive research tools** — live calculators for
  TAM/SAM/SOM, burn rate, unit economics, and runway.
  Inputs update outputs in real time — no page reload.
  Competitor tracker, customer persona builder, customer
  discovery log. Your numbers compared against benchmarks
  for your startup type.

- **Path analysis + financial planning** — burn rate,
  runway, unit economics (CAC / LTV / payback period),
  structured comparison of lean / bootstrapped / funded
  launch paths. "Which path wastes less money" becomes a
  calculation, not a guess.

- **AI planning assistant** — Claude-powered advisor mode
  that asks structured questions and builds a personalised
  plan. Market research synthesis, competitor analysis,
  risk identification, and "what to do next" — all
  grounded in the founder's type, stage, and current
  inputs.

- **Gamification** — the core motivation engine. Founding
  a startup is a long, lonely grind; progress feels
  invisible. Streaks keep founders coming back daily. XP +
  levels make incremental progress tangible. Badges
  celebrate real milestones. The leaderboard adds social
  proof and healthy competition. All five systems are one
  coherent loop, not separate features.

- **Community** — forum for founder Q&A, progress feed,
  peer accountability.

- **Plan export** — download your full roadmap as a PDF
  for investors or co-founders.

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
notification fan-out matters (Phase 5).

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

### Phase 1 — Gamification loop (build next)

The motivation engine is the product's defining feature —
without it LaunchPad is just another to-do list. All five
subsystems (streaks, XP/levels, badges, leaderboard,
progress) share service logic in the backend but have
**no HTTP controllers and no migrations** yet.

The leaderboard is part of gamification, not a separate
feature. Seeing where you rank against other founders is
a powerful social nudge that amplifies every other signal.

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 1.1 | Streaks: controllers + migration                  | ⬜     |
| 1.2 | XP + levels + progress: controllers + migrations  | ⬜     |
| 1.3 | Badges: controllers + migration                   | ⬜     |
| 1.4 | Leaderboard: controllers + migration              | ⬜     |
| 1.5 | Frontend: streak counter, XP bar, level badge     | ⬜     |
| 1.6 | Frontend: badge cabinet page                      | ⬜     |
| 1.7 | Frontend: leaderboard page (opt-in, D3)           | ⬜     |
| 1.8 | Wire planner step completion → XP + streak events | ⬜     |

### Phase 2 — Startup type framework (architectural foundation)

Everything else in the product — planner steps, AI advice,
market research prompts, path recommendations — depends on
knowing what kind of startup the founder is building.
This is the bedrock phase.

New service: `services/startup-types/`

This phase builds both the knowledge layer (what each
startup type is, its typical path, its failure modes)
and the interactive layer (a dynamic planner that adapts
to the founder's type).

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 2.1 | Startup type catalogue (backend + migration)      | ⬜     |
|     | SaaS, marketplace, e-commerce, hardware,          |        |
|     | services, fintech, health, content, platform      |        |
| 2.2 | Per-type: stages, common traps, funding paths     | ⬜     |
| 2.3 | Onboarding: startup type selector UI              | ⬜     |
| 2.4 | Dynamic planner: steps adapt to selected type     | ⬜     |
| 2.5 | Per-type stage gates (what to validate before     | ⬜     |
|     | moving to the next stage)                         |        |
| 2.6 | Knowledge base: startup guide per type            | ⬜     |
|     | (inline reference, browsable, searchable)         |        |
| 2.7 | Launch playbook library: go-to-market,            | ⬜     |
|     | fundraising, hiring — per startup type            |        |
| 2.8 | Industry benchmarks per type (CAC, LTV, churn,    | ⬜     |
|     | time-to-revenue) — used for comparison in Phase 3 |        |

### Phase 3 — Market research tools

Founders need instruments to validate before spending.
All calculators in this phase are **live**: inputs update
outputs in real time with no page reload. Saved values
persist to the backend; computation runs client-side.

New service: `services/market-research/`

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 3.1 | TAM / SAM / SOM live calculator                   | ⬜     |
| 3.2 | Competitor tracker (name, stage, strengths/gaps)  | ⬜     |
| 3.3 | Customer persona builder                          | ⬜     |
| 3.4 | Customer discovery log (interviews + findings)    | ⬜     |
| 3.5 | Benchmark comparison: your TAM vs. industry       | ⬜     |
|     | averages for your startup type (from Phase 2.8)   |        |
| 3.6 | Market research dashboard page                    | ⬜     |
| 3.7 | AI synthesis: summarise research findings,        | ⬜     |
|     | compare against benchmarks, surface blind spots   |        |

### Phase 4 — Path analysis + financial planning

"Which path wastes less money" is a calculation. All
financial tools are **live calculators** — change your
monthly burn and the runway updates instantly. The path
comparison tool is AI-generated from your specific
context, not a static table.

New service: `services/financials/`

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 4.1 | Burn rate + runway live calculator                | ⬜     |
| 4.2 | Unit economics live model (CAC, LTV, payback)     | ⬜     |
| 4.3 | Path comparison: lean vs bootstrapped vs funded   | ⬜     |
|     | — AI-generated pros/cons given your type +        |        |
|     | capital + market data                             |        |
| 4.4 | Kill criteria / pivot signals per startup type    | ⬜     |
| 4.5 | Hypothesis tracker (assumption → test → result)   | ⬜     |
| 4.6 | "What to do next" engine: reads stage, progress,  | ⬜     |
|     | gaps, surfaces single most important next action  |        |
| 4.7 | Financial planning dashboard page                 | ⬜     |

### Phase 5 — Notifications

Founders need reminders to maintain streaks and alerts
when stage gates unlock. Backend is fully implemented
(controllers + migrations ✅).

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 5.1 | `/notifications` inbox page                       | ⬜     |
| 5.2 | Notification bell badge in Navbar (live count)    | ⬜     |
| 5.3 | Planner events → notification triggers            | ⬜     |
| 5.4 | Email digest (daily planner reminder)             | ⬜     |

### Phase 6 — Community

Founders helping founders. Backend (comments/forum,
social) is fully implemented with controllers +
migrations ✅.

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 6.1 | `/community` forum page (boards + threads)        | ⬜     |
| 6.2 | Startup-type boards (SaaS, marketplace, etc.)     | ⬜     |
| 6.3 | Inline comments on planner milestones             | ⬜     |
| 6.4 | `/feed` — progress feed (follows + activity)      | ⬜     |
| 6.5 | Follow / unfollow other founders                  | ⬜     |

### Phase 7 — Plan export and AI enhancements

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 7.1 | Export plan as PDF (backend: pdf domain ✅)        | ⬜     |
| 7.2 | AI suggestions per planner step (prompt tuning)   | ⬜     |
| 7.3 | Save AI chat threads to planner steps             | ⬜     |
| 7.4 | AI risk report: blind spots in the current plan   | ⬜     |

### Phase 8 — Ops and quality

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 8.1 | Impersonation hardening (DB-backed session)       | ⬜     |
| 8.2 | `CookieAuthFilter` reject refresh tokens for API  | ⬜     |
| 8.3 | `usePlannerProgress.ts` threshold tuning          | ⬜     |
| 8.4 | Admin analytics dashboard                         | ⬜     |
| 8.5 | CSP + security headers middleware                 | ⬜     |
| 8.6 | Frontend test coverage: 60% of organisms          | ⬜     |
| 8.7 | Backend GTest: badges, leaderboards, streaks, xp  | ⬜     |
| 8.8 | Playwright suites for each new page above         | ⬜     |

### Cross-cutting

| ID  | Item                                                |
|-----|-----------------------------------------------------|
| X1  | Real-time WebSocket bus (chat + streak alerts + feed)|
| X2  | Feature flags for gradual rollout of community      |
| X3  | External data integrations (Crunchbase, SimilarWeb) |
| X4  | Advisor mode: AI asks structured diagnostic         |
|     | questions and assembles a personalised plan from    |
|     | scratch — entry point for new founders              |
| X5  | Knowledge base search: Elasticsearch indexes all    |
|     | guides, playbooks, and benchmarks; surfaced in the  |
|     | existing `/search` page                             |

---

## 5. Design decisions

| #   | Decision                                                    |
|-----|-------------------------------------------------------------|
| D1  | Gamification is the core motivation engine — streaks, XP,  |
|     | levels, badges, and leaderboard are one system, not five   |
|     | separate features                                          |
| D2  | Gamification events triggered by planner step completion,  |
|     | not arbitrary actions — keeps motivation tied to product   |
| D3  | Leaderboard is opt-in (founders can hide from ranking)     |
| D4  | Planner steps are dynamic per startup type — no single     |
|     | hardcoded step list; type catalogue drives the path        |
| D5  | Market research v1 = manual entry + AI synthesis;          |
|     | external API integrations (Crunchbase etc.) are Phase X3   |
| D6  | Path comparison is AI-generated given founder's type,      |
|     | skills, capital, and market data — not a static table      |
| D7  | Community boards are organised by startup type (SaaS,      |
|     | marketplace, etc.) — domain-relevant peer groups           |
| D8  | Forum is founder Q&A only (no off-topic boards v1)         |
| D9  | PDF export uses template's Gotenberg sidecar               |
| D10 | Package repo auth = self-contained JWT (not Keycloak SSO)  |
| D11 | Package repo blob store = MinIO (`packagerepo` bucket)     |
| D12 | Interactive calculators compute client-side (React         |
|     | state); backend only stores saved inputs — no round-trip   |
|     | per keystroke                                              |
| D13 | Knowledge base content is admin-curated JSON/markdown      |
|     | per startup type — not a user-editable wiki                |
| D14 | AI advisor has access to both the knowledge base context   |
|     | for the founder's type and their live inputs/progress —    |
|     | answers are grounded in curated best practice AND          |
|     | specific to the founder's situation                        |

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
- `wiki` — LaunchPad's knowledge base is admin-curated
  content per startup type (D13), not a user-editable
  wiki; the wiki service is not used
- `imap-sync` — no email inbox

---

## 7. Open questions

| #  | Question                                               | Default            |
|----|--------------------------------------------------------|--------------------|
| Q1 | Startup types: fixed catalogue or founder can add      | Fixed v1           |
|    | custom type?                                           |                    |
| Q2 | Market research: public (visible to community) or      | Private by default |
|    | private per founder?                                   |                    |
| Q3 | Path comparison: show all paths or only the top 2-3   | Top 3              |
|    | most relevant to the founder's type?                   |                    |
| Q4 | Financial planning: simple burn/runway only, or full  | Simple v1          |
|    | P&L / cap table?                                       |                    |
| Q5 | Community v1: forum only, or also DMs?                 | Forum only         |
| Q6 | PDF export: full plan only, or per-section too?        | Full plan first    |
| Q7 | AI suggestions: on-demand button or auto-generated?    | On-demand          |
| Q8 | Planner steps: locked until previous done, or free?    | Free (any order)   |
| Q9 | Leaderboard: opt-in ranking or always visible?         | Opt-in (D3)        |
| Q10| Knowledge base content: seed via admin UI or bake      | Baked JSON v1      |
|    | into startup-types service as static JSON at deploy?   |                    |
| Q11| Advisor mode: gated behind completing the startup      | Gated              |
|    | type selector, or available from the start?            |                    |
