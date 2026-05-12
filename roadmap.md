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

**LaunchPad** is a free, structured guide from idea to
paying customers for any type of startup.

Most startups fail not because founders lack ideas but
because they don't know what to validate first, waste
money on the wrong path, skip legal and compliance steps
they didn't know existed, and run out of runway before
finding product-market fit. LaunchPad addresses all of
this.

**LaunchPad is simultaneously a knowledge base and an
interactive tool.** Both are required:

- A *knowledge base* tells you what a SaaS startup is,
  what its failure modes are, what a founder agreement
  needs to cover, how SEIS/EIS works, and what a
  go-to-market playbook looks like. Browsable, searchable,
  admin-curated. **Powered by the wiki backend** —
  full revision history, tree navigation, markdown
  rendering, and an admin editor — all built.

- An *interactive tool* takes your actual numbers, your
  market, your skills, and your stage, and tells you what
  *you specifically* should do next. Live calculators.
  Structured frameworks. AI synthesis.

The AI is the bridge: it reads the knowledge base context
for your type *and* your live inputs, then synthesises
curated best practice with your specific situation.

**Core capabilities:**

- **Startup type framework** — SaaS, marketplace,
  e-commerce, hardware, services, fintech, health, content,
  and platform startups all have different critical paths,
  cost curves, and failure modes. The planner is dynamic:
  steps, stage gates, and advice adapt to type.

- **Knowledge base** — guides, playbooks, benchmarks,
  legal primers, compliance checklists, funding guides,
  and industry-specific content. Organised by startup type
  and stage. Powered by the wiki backend (D15).

- **Legal & compliance** — business structure guide,
  registration checklist, IP basics, co-founder agreement
  template, GDPR/privacy primer, industry-specific
  regulatory guides (fintech, health, food). One of the
  biggest unknown unknowns for first-time founders.

- **Co-founder & team tools** — equity split calculator,
  founder vesting schedule, co-founder agreement
  checklist, advisor equity guide, team role planner
  (when to hire which roles and in what order).

- **Interactive research tools** — live calculators for
  TAM/SAM/SOM, burn rate, unit economics, and runway.
  Inputs update outputs in real time. Competitor tracker,
  customer persona builder, discovery log. Your numbers
  compared against benchmarks for your type.

- **Business model canvas** — one-page structured
  overview of the business: problem, solution, UVP,
  channels, customer segments, cost structure, revenue
  streams. The foundational planning artefact that all
  other tools reference.

- **Financial planning + funding readiness** — burn
  rate, runway, unit economics, revenue model,
  pricing calculator, revenue projections, break-even.
  Path comparison, cap table basics, pitch deck guide,
  investor readiness, SEIS/EIS, grant finder.
  Post-launch: KPI dashboard, growth accounting,
  PMF measurement, investor update templates.

- **Decision log** — a running record of every
  significant decision: what was decided, why, and what
  alternatives were ruled out. Searchable, linked to
  planner steps. Invaluable for new team members and
  investors. Almost no tools offer this.

- **Weekly review cadence** — structured weekly prompts
  (what worked, what didn't, key metrics, next week
  focus). The primary streak-driver: founders who do
  weekly reviews consistently out-execute those who
  don't.

- **AI planning assistant** — advisor mode that asks
  structured questions and builds a personalised plan.
  Market research synthesis, competitor analysis,
  risk identification, "what to do next" — grounded
  in the founder's type, stage, and current inputs.

- **Gamification** — the core motivation engine.
  Founding is a long, lonely grind; progress feels
  invisible. Streaks, XP, levels, badges, and the
  leaderboard are one coherent motivation loop.

- **Team workspace** — co-founders share one startup
  entity. The planner, canvas, and financials are
  per-startup; gamification is per-founder. Invite
  co-founders by email; each gets their own streaks
  and XP while working on the shared plan.

- **Milestone timeline** — declared real-world
  achievements (first customer, first £1k MRR,
  launch day, first hire) celebrated with badges,
  XP, and an optional social share card.

- **Community** — forum organised by startup type,
  progress feed, peer accountability.

- **Plan export** — full roadmap as a PDF.

Template backends not surfaced in LaunchPad's UI:
ecommerce, video, gallery, blog, live streaming,
IMAP sync.

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

Kafka runs gracefully in stub mode. It becomes relevant
when real-time notification fan-out matters (Phase 6).

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
progress) share backend service logic but have **no HTTP
controllers and no migrations** yet.

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
| 1.9 | Wire weekly review completion → streak event      | ⬜     |

### Phase 2 — Startup type framework + knowledge base

Everything else in the product depends on knowing what
kind of startup the founder is building. The knowledge
base is powered by the existing wiki backend (D15):
full revision history, admin editor, tree nav, and
markdown rendering — all already built.

New service: `services/startup-types/`
Repurposed service: `services/wiki/` → knowledge base

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 2.1 | Startup type catalogue (backend + migration)      | ⬜     |
|     | SaaS, marketplace, e-commerce, hardware,          |        |
|     | services, fintech, health, content, platform      |        |
| 2.2 | Per-type: stages, common traps, funding paths     | ⬜     |
| 2.3 | Onboarding: startup type selector UI              | ⬜     |
| 2.4 | Dynamic planner: steps adapt to selected type     | ⬜     |
| 2.5 | Per-type stage gates                              | ⬜     |
| 2.6 | Wiki migration: add kb_type, startup_type, stage, | ⬜     |
|     | tags columns to wiki_pages (D15)                  |        |
| 2.7 | `/knowledge` read-only frontend route wrapping    | ⬜     |
|     | wiki backend; tree nav + search                   |        |
| 2.8 | Seed knowledge base: startup guides, playbooks,   | ⬜     |
|     | benchmarks per type via wiki admin panel          |        |
| 2.9 | Onboarding wizard: name, startup type, current    | ⬜     |
|     | stage, co-founder status, biggest challenge —     |        |
|     | personalises dashboard + planner from day one.    |        |
|     | Until complete, dashboard shows setup prompt.     |        |
| 2.10| Startup entity: shared workspace for co-founders. | ⬜     |
|     | Planner, canvas, and financials are per-startup;  |        |
|     | streaks/XP/badges remain per-user (D23)           |        |
| 2.11| Co-founder invite: invite by email; invitee links | ⬜     |
|     | to existing startup workspace                     |        |
| 2.12| Startup public profile: shareable page (name,     | ⬜     |
|     | type, stage, one-liner, team) — links to from     |        |
|     | community, leaderboard, and investor sharing      |        |

### Phase 3 — Legal, compliance & team foundations

One of the biggest unknown unknowns for first-time
founders. Gets its own phase because it is foundational
knowledge that should come before spending money on
market research or product.

Content lives in the wiki knowledge base. Interactive
tools (calculators) live in a new `services/legal-team/`
domain.

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 3.1 | Business structure guide: sole trader, LLP, Ltd,  | ⬜     |
|     | C-Corp — pros/cons, tax implications, per type    |        |
| 3.2 | Company registration checklist (per jurisdiction) | ⬜     |
| 3.3 | IP primer: trademark, patent, copyright, trade    | ⬜     |
|     | secret — what applies to each startup type        |        |
| 3.4 | Founder agreement checklist + template            | ⬜     |
| 3.5 | Equity split calculator (role, contribution,      | ⬜     |
|     | risk weighting)                                   |        |
| 3.6 | Founder vesting schedule calculator               | ⬜     |
|     | (cliff, total period, acceleration)               |        |
| 3.7 | Advisor equity guide + typical ranges             | ⬜     |
| 3.8 | GDPR / privacy basics for product builders        | ⬜     |
| 3.9 | Industry-specific regulatory guides: fintech      | ⬜     |
|     | (FCA/SEC), health (MHRA/FDA), food, proptech      |        |
| 3.10| Team role planner: when to hire what, in order    | ⬜     |

### Phase 4 — Market research tools

Founders validate before spending. All calculators are
**live** — inputs update outputs with no page reload.

New service: `services/market-research/`

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 4.1 | TAM / SAM / SOM live calculator                   | ⬜     |
| 4.2 | Competitor tracker (name, stage, strengths/gaps)  | ⬜     |
| 4.3 | Customer persona builder                          | ⬜     |
| 4.4 | Customer discovery log (interviews + findings)    | ⬜     |
| 4.5 | Interview script templates per startup type       | ⬜     |
| 4.6 | Benchmark comparison: your TAM vs. industry       | ⬜     |
|     | averages for your type (from Phase 2 seed data)   |        |
| 4.7 | Business model canvas: problem, solution, UVP,    | ⬜     |
|     | channels, customer segments, cost structure,      |        |
|     | revenue streams — one-page live overview          |        |
| 4.8 | Market research dashboard page                    | ⬜     |
| 4.9 | AI synthesis: summarise findings, compare to      | ⬜     |
|     | benchmarks, surface blind spots                   |        |

### Phase 5 — Financial planning + funding readiness

"Which path wastes less money" is a calculation. All
financial tools are **live calculators**. Funding
readiness is included here — the two are inseparable.

New service: `services/financials/`

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 5.1 | Burn rate + runway live calculator                | ⬜     |
| 5.2 | Unit economics live model (CAC, LTV, payback)     | ⬜     |
| 5.3 | Path comparison: lean vs bootstrapped vs funded   | ⬜     |
|     | — AI-generated pros/cons per context              |        |
| 5.4 | Kill criteria / pivot signals per startup type    | ⬜     |
| 5.5 | Hypothesis tracker (assumption → test → result)   | ⬜     |
| 5.6 | Startup health score: composite signal from       | ⬜     |
|     | planner progress + research + runway + team       |        |
| 5.7 | Financial planning dashboard page                 | ⬜     |
| 5.8 | Funding stage guide: bootstrapped → pre-seed →    | ⬜     |
|     | seed → Series A — what each stage requires        |        |
| 5.9 | Investor type guide: angel, VC, crowdfunding,     | ⬜     |
|     | grants — what suits each startup type             |        |
| 5.10| Pitch deck structure guide + section template     | ⬜     |
| 5.11| Investor readiness checklist                      | ⬜     |
| 5.12| Cap table basics + simple simulator               | ⬜     |
| 5.13| SEIS / EIS eligibility guide (UK) + grant finder  | ⬜     |
| 5.14| Revenue model selector: freemium, subscription,   | ⬜     |
|     | usage-based, per-seat, marketplace fee, one-time  |        |
|     | — guide + pros/cons per startup type              |        |
| 5.15| Pricing live calculator: target MRR → required    | ⬜     |
|     | customers at given price point; tier modelling    |        |
| 5.16| Revenue projections: customers × ARPU = MRR,      | ⬜     |
|     | simple growth curve, break-even point             |        |
| 5.17| PMF measurement: Sean Ellis survey widget (40%    | ⬜     |
|     | "very disappointed" threshold) + retention cohort |        |
|     | indicator — answers "when am I done validating?"  |        |
| 5.18| Post-launch KPI dashboard: MAU, MRR/ARR, churn,   | ⬜     |
|     | NPS — surfaces after founder marks product live   |        |
| 5.19| Growth accounting view: new / retained / churned  | ⬜     |
|     | users per period; visualises growth health        |        |
| 5.20| Monthly business review template                  | ⬜     |
| 5.21| Investor update templates (monthly + quarterly)   | ⬜     |
| 5.22| Due diligence data room checklist                 | ⬜     |
| 5.23| Milestone timeline: first customer, first £1k MRR,| ⬜     |
|     | launch day, first hire — celebrated achievements  |        |
|     | distinct from planner steps; badges tied to these |        |

### Phase 6 — Notifications

Founders need reminders to maintain streaks and alerts
when stage gates unlock. Backend ✅.

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 6.1 | `/notifications` inbox page                       | ⬜     |
| 6.2 | Notification bell badge in Navbar (live count)    | ⬜     |
| 6.3 | Planner events → notification triggers            | ⬜     |
| 6.4 | Email digest (daily planner reminder)             | ⬜     |

### Phase 7 — Community

Founders helping founders. Backend ✅.

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 7.1 | `/community` forum page (boards + threads)        | ⬜     |
| 7.2 | Startup-type boards (SaaS, marketplace, etc.)     | ⬜     |
| 7.3 | Inline comments on planner milestones             | ⬜     |
| 7.4 | `/feed` — progress feed (follows + activity)      | ⬜     |
| 7.5 | Follow / unfollow other founders                  | ⬜     |
| 7.6 | Mentor opt-in: experienced founders mark          | ⬜     |
|     | themselves available; badge + feed signal         |        |

### Phase 8 — Plan export + AI enhancements

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 8.1 | Export plan as PDF (backend: pdf domain ✅)        | ⬜     |
| 8.2 | AI suggestions per planner step (prompt tuning)   | ⬜     |
| 8.3 | Save AI chat threads to planner steps             | ⬜     |
| 8.4 | AI risk report: blind spots in the current plan   | ⬜     |
| 8.5 | AI document drafting: generate pitch deck outline,| ⬜     |
|     | investor update, NDA draft, job description —     |        |
|     | seeded from the founder's own plan data           |        |

### Phase 9 — Ops and quality

| ID  | Item                                              | Status |
|-----|---------------------------------------------------|--------|
| 9.1 | Impersonation hardening (DB-backed session)       | ⬜     |
| 9.2 | `CookieAuthFilter` reject refresh tokens for API  | ⬜     |
| 9.3 | `usePlannerProgress.ts` threshold tuning          | ⬜     |
| 9.4 | Admin analytics dashboard                         | ⬜     |
| 9.5 | CSP + security headers middleware                 | ⬜     |
| 9.6 | Frontend test coverage: 60% of organisms          | ⬜     |
| 9.7 | Backend GTest: badges, leaderboards, streaks, xp  | ⬜     |
| 9.8 | Playwright suites for each new page above         | ⬜     |
| 9.9 | GDPR: user data export (right of access)          | ⬜     |
| 9.10| GDPR: account deletion (right to erasure)         | ⬜     |
| 9.11| Cookie consent management                         | ⬜     |
| 9.12| WCAG 2.1 AA compliance audit + remediation        | ⬜     |
| 9.13| API key settings UX: label, help text, validation  | ⬜     |
|     | feedback for Anthropic + OpenAI keys (D27)         |        |

### Cross-cutting

| ID  | Item                                                |
|-----|-----------------------------------------------------|
| X1  | Real-time WebSocket bus (chat + streak alerts + feed)|
| X2  | Feature flags for gradual rollout of community      |
| X3  | External data integrations (Crunchbase, SimilarWeb) |
| X4  | Advisor mode: AI diagnostic → personalised plan     |
| X5  | Knowledge base search via existing `/search` page   |
| X6  | Decision log: record decisions + rationale,         |
|     | searchable, linked to planner steps                 |
| X7  | Weekly review prompts: structured reflection form   |
|     | that drives the daily streak                        |
| X8  | Launch execution checklist: Product Hunt, HN Show,  |
|     | press, social — per startup type                    |
| X9  | Product scoping canvas: MVP cut list, ICE/RICE      |
|     | feature prioritisation tool                         |
| X10 | Resource library: downloadable templates (NDA,      |
|     | founder agreement, cap table, pitch deck skeleton)  |
| X11 | Pivot tracker: formal record of direction changes   |
|     | — original idea, what changed, why, plan impact.   |
|     | Distinct from hypothesis tracker; linked to         |
|     | decision log                                        |
| X12 | Accelerator & competition tracker: database of      |
|     | programmes (YC, Techstars, Seedcamp, etc.) with     |
|     | deadlines + application status per founder          |
| X13 | Channel-fit guide: acquisition channels per startup |
|     | type with rough CAC estimates — helps founders      |
|     | choose where to spend first                         |
| X14 | Milestone social cards: "share this moment" button  |
|     | generates a branded card for Twitter/LinkedIn.      |
|     | Viral loop for LaunchPad — every shared milestone   |
|     | is an organic impression                            |
| X15 | Email sequences: welcome drip (days 1/3/7),         |
|     | streak-at-risk alert (24 h before break), 30-day    |
|     | re-engagement for dormant founders                  |
| X16 | Real-data integrations: Stripe webhook → actual     |
|     | MRR; accounting tool (Xero/FreeAgent/QuickBooks)    |
|     | → actual costs. Replaces manual entry in financial  |
|     | tools with live data once connected.                |
| X17 | KB content feedback: thumbs up/down on knowledge    |
|     | base articles — surfaces low-quality content to     |
|     | admins; improves KB over time                       |

---

## 5. Design decisions

| #   | Decision                                                    |
|-----|-------------------------------------------------------------|
| D1  | Gamification is the core motivation engine — streaks, XP,  |
|     | levels, badges, and leaderboard are one system, not five   |
|     | separate features                                          |
| D2  | Gamification events triggered by planner step completion   |
|     | and weekly review completion — keeps motivation tied to    |
|     | real progress, not arbitrary actions                       |
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
| D13 | Knowledge base content is admin-curated, not               |
|     | user-editable — only admins can create/edit KB pages       |
| D14 | AI advisor has access to both the knowledge base context   |
|     | for the founder's type and their live inputs/progress —    |
|     | answers are grounded in curated best practice AND          |
|     | specific to the founder's situation                        |
| D15 | Knowledge base is powered by the wiki backend: same        |
|     | wiki_pages table + revision history + admin editor.        |
|     | A migration adds kb_type, startup_type, stage, tags        |
|     | columns. The `/knowledge` frontend route reads the wiki    |
|     | API in read-only mode. No new CMS service needed.          |
| D16 | Legal & compliance content lives in the knowledge base     |
|     | (wiki-powered); interactive calculators (equity split,     |
|     | vesting) live in services/legal-team/                      |
| D17 | Weekly review is the primary streak-driver (D2). The       |
|     | weekly review form lives on the dashboard; skipping a      |
|     | week breaks the streak.                                    |
| D18 | Decision log entries are linked to planner steps by        |
|     | optional step_id FK; they are always private to the        |
|     | founder unless explicitly shared                           |
| D19 | Onboarding wizard is mandatory before the planner          |
|     | personalises itself. The dashboard shows a "complete       |
|     | setup" prompt until the wizard is done. No hard feature    |
|     | gates — founders can explore the app freely, but the       |
|     | planner steps remain generic until type is confirmed.      |
| D20 | Business model canvas is the central planning artefact.    |
|     | The planner, market research, and financial tools all       |
|     | reference canvas fields — changes in one surface in        |
|     | others. Canvas lives in services/startup-types/.           |
| D21 | PMF measurement unlocks post-launch KPI tools. The         |
|     | Sean Ellis survey and retention cohort tracker are         |
|     | shown after the founder marks their product as live.       |
|     | Pre-launch, these sections show a "not yet available"      |
|     | state with an explanation of what PMF means.               |
| D22 | AI document drafting uses the founder's saved plan data    |
|     | as context — pitch deck outline is seeded from the         |
|     | business model canvas and financial inputs, not generated  |
|     | from scratch.                                              |
| D23 | Unit of account: User + Startup entity. Each user has      |
|     | one active startup. Multiple users (co-founders) belong    |
|     | to one startup. Gamification (streaks, XP, badges,         |
|     | leaderboard) is per-user. Planner, canvas, financials,     |
|     | decision log, and market research are per-startup.         |
|     | This must be decided before Phase 2 data models are set.   |
| D24 | Mobile-first for the two highest-frequency flows:          |
|     | streak check-in and weekly review. These happen            |
|     | wherever founders are — commuting, between meetings.       |
|     | The layout and tap targets for these flows must be         |
|     | designed for a phone screen first.                         |
| D25 | Milestone timeline events (first customer, first £1k MRR,  |
|     | launch day) are founder-declared, not system-detected.     |
|     | The founder marks them; the system celebrates. Badges      |
|     | and XP awards fire on declaration.                         |
| D26 | LaunchPad is free — no subscription tiers, no feature      |
|     | gating. Revenue comes from the businesses founders build   |
|     | using it, not from the tool itself.                        |
| D27 | AI features run on the built-in shared API key by default  |
|     | (rate-limited). Founders who add their own Anthropic or    |
|     | OpenAI key in profile settings use their own quota — more  |
|     | AI calls, faster responses, choice of model. The settings  |
|     | API key store is already built; this needs UX polish       |
|     | only (label, help text, key validation feedback).          |

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

| Domain        | Notes                                        |
|---------------|----------------------------------------------|
| gamification  | Service logic only — no controllers yet      |
| notifications | Full backend ✅ — no inbox page              |
| forum/comments| Full backend ✅ — no `/community` page       |
| social        | Full backend ✅ — no `/feed` page            |
| pdf           | Full backend ✅ — no export trigger UI       |
| ai-chat       | Full backend ✅ — not yet linked to planner  |
| wiki          | Full backend ✅ — repurposed as KB (D15);    |
|               | needs metadata migration (2.6) + /knowledge  |
|               | frontend route (2.7)                         |
| search        | Retooled: 4 LaunchPad indexes; frontend tabs |
|               | updated. Content feeds in from Phase 2 on.   |

### ❌ Out of scope for LaunchPad

Template backends that will not appear in the UI:

- `blog` — not a blogging platform
- `gallery` — no photo albums
- `ecommerce` — no storefront
- `video` / `streaming` — no media platform
- `imap-sync` — no email inbox
- `wiki` (user-facing wiki UI) — the wiki **backend**
  is repurposed as the knowledge base CMS (D15); the
  public wiki UI is not used

---

## 7. Open questions

| #   | Question                                              | Default            |
|-----|-------------------------------------------------------|--------------------|
| Q1  | Startup types: fixed catalogue or founder can add     | Fixed v1           |
|     | custom type?                                          |                    |
| Q2  | Market research: visible to community or private?     | Private by default |
| Q3  | Path comparison: all paths or top 3 per context?      | Top 3              |
| Q4  | Financial planning: burn/runway only, or full P&L?    | Simple v1          |
| Q5  | Community v1: forum only, or also DMs?                | Forum only         |
| Q6  | PDF export: full plan only, or per-section too?       | Full plan first    |
| Q7  | AI suggestions: on-demand or auto-generated?          | On-demand          |
| Q8  | Planner steps: locked until previous done, or free?   | Free (any order)   |
| Q9  | Leaderboard: opt-in or always visible?                | Opt-in (D3)        |
| Q10 | KB content: seed via wiki admin or static JSON?       | Wiki admin         |
| Q11 | Advisor mode: gated behind type selector or open?     | Gated              |
| Q12 | Legal content: generic or jurisdiction-specific?      | Generic + UK/US    |
|     | (UK/US covers the majority of target users)           |                    |
| Q13 | Equity calculator: simple split or weighted scoring?  | Weighted scoring   |
|     | (role, time commitment, capital contribution, risk)   |                    |
| Q14 | Weekly review: mandatory for streak or optional?      | Mandatory (D17)    |
| Q15 | Decision log: private always, or shareable with       | Private (D18)      |
|     | investors/co-founders via link?                       |                    |
| Q16 | LaunchPad monetisation: free, freemium, or paid       | ✅ Free (D26)      |
|     | subscription? Which features are gated?               |                    |
| Q17 | Planner step versioning: when the type catalogue is   | Additive only v1   |
|     | updated, how do existing founders' plans migrate?     |                    |
| Q18 | Post-launch tools: always visible, or unlocked only   | Unlocked (D21)     |
|     | after founder marks product as live?                  |                    |
| Q19 | Business model canvas: free-form or structured        | Structured fields  |
|     | fields with guided prompts per startup type?          |                    |
| Q20 | Pivot tracker: part of the decision log, or a         | Separate section   |
|     | separate dedicated section?                           |                    |
| Q21 | Team workspace: can a user belong to multiple         | One active startup |
|     | startups simultaneously (portfolio founder), or       |                    |
|     | one active at a time?                                 |                    |
| Q22 | Milestone social cards: opt-in share prompt after     | Opt-in prompt      |
|     | declaring a milestone, or manual share button only?   |                    |
| Q23 | Real-data integrations (Stripe, Xero): Phase 5 or     | Post-launch phase  |
|     | deferred until post-launch KPI tools land?            |                    |
