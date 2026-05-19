# 🚀 LaunchPad

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![C++20](https://img.shields.io/badge/C%2B%2B-20-00599C?logo=cplusplus)](https://isocpp.org/)
[![Drogon](https://img.shields.io/badge/Drogon-1.9.8-blue)](https://github.com/drogonframework/drogon)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A step-by-step startup company setup guide — six phases from idea to
first paying customer, with every task explained and an AI advisor at
each step. Built on a full-stack Next.js + C++ Drogon monorepo with
Keycloak SSO, PostgreSQL, and Elasticsearch.

## Quick Start

```bash
git clone https://github.com/your-org/businessplanner.git
cd businessplanner
docker compose up --build
```

Open **http://localhost:8892/app/en** — the app is behind an Nginx
portal on port **8892**.

Sign in with the [dev credentials](#dev-credentials) below.

---

## What It Does

| Feature | URL | Description |
|---|---|---|
| Startup Roadmap | `/app/en/planner` | Six-phase interactive checklist (validate → build → legal → finance → product → launch) |
| Skills Profile | `/app/en/profile` | Enter your role, skill tags, and qualifications background |
| AI Advisor | `/app/en/chat` | Ask anything about starting a business |
| Sign In | `/app/en/login` | Keycloak OIDC flow → JWT cookies → avatar in navbar |

---

## Architecture

```
  Browser ─────────────────────────────► Nginx  :8892
                                            │
          ┌─────────────┬─────────────┬─────┘
          │ /app        │ /api        │ /sso
          ▼             ▼             ▼
    Next.js 16     Drogon C++     Keycloak 26
    TypeScript     REST/JSON      OIDC SSO
    port 3000      port 8080      port 8080
          │             │
          └──────┬───────┘
                 │
    ┌────────────┼──────────────┐
    ▼            ▼              ▼
PostgreSQL  Elasticsearch    Redis
 port 5432   port 9200
```

The codebase is a **domain-sliced monorepo** — every feature lives
under `services/<domain>/` with its own C++ service code, Drogon
controllers, SQL migrations, GTest tests, and optional operator UI.

---

## Dev Credentials

Sign in at **http://localhost:8892/app/en/login** (redirects to
Keycloak automatically):

| Role      | Username  | Email                      | Password  |
|-----------|-----------|----------------------------|-----------|
| Admin     | devadmin  | dev.admin@businessplanner.local     | DevAdmin1 |
| Moderator | devmod    | dev.mod@businessplanner.local       | DevMod1a  |
| User      | devuser   | dev.user@businessplanner.local      | DevUser1  |

User definitions live in `services/users/seeds/users.json`.

**Never use these credentials in production.**

---

## Monorepo Layout

```
services/
  auth/             OIDC token exchange + session validation
  users/            User accounts + seed data
  user-preferences/ Theme, locale, AI provider preferences
  i18n/             Backend translation storage
  planner/          Startup roadmap phases + steps
  sso/portal        Keycloak login shell (Next.js)
  drogon-host/      Drogon shell: main.cpp, serve, config, Dockerfile
  http-filters/     JWT / CORS / rate-limit Drogon filters
  orm-models/       Drogon ORM generated models
  manager-cli/      C++ project automation CLI
  migration-runner/ Topo-sorted per-domain SQL migrator
  ...               (40+ more feature domains)
frontend/           Next.js 16 main app (all locales, App Router)
shared/             M3 component library, SCSS tokens, Playwright runner
docker/             Nginx config, Keycloak realm export, pre-baked images
docs/               Architecture, domain layout, guides
```

---

## SSO / Authentication

Authentication is handled by **Keycloak 26** behind Nginx at `/sso/`.
The frontend uses a PKCE OAuth 2.0 flow — no credentials ever touch the
Next.js server:

```
/app/en/login  →  Keycloak /sso/realms/businessplanner/…  →  /app/en/auth/callback
```

Tokens are stored in `HttpOnly`-style cookies (`businessplanner_sso`,
`businessplanner_sso_refresh`) and refreshed silently before expiry by the
`useKeycloakRefresh` hook.

The realm is imported fresh on first Keycloak start from
`docker/keycloak/realm-export.json`. To force a re-import (e.g. after
changing redirect URIs):

```bash
docker compose stop keycloak keycloak-db
docker volume rm businessplanner_keycloak_pgdata
docker compose up -d keycloak-db keycloak
```

---

## Rebuilding After Changes

Every container is an **immutable image** — no bind mounts for source.
Rebuild only the affected service after editing source or config:

```bash
# Frontend source changes
SRC_BUST=$(date +%s) docker compose up --build --no-deps -d frontend

# Nginx config changes
docker compose up --build --no-deps -d portal

# Keycloak realm export changes
# (must also wipe the DB volume — see SSO section above)

# Backend C++ changes
docker compose up --build --no-deps -d backend
```

---

## Running the Stack

```bash
# Start everything
docker compose up --build

# Detached mode
docker compose up --build -d
docker compose logs -f          # follow all logs
docker compose logs frontend -f # follow one service
docker compose down             # stop everything
```

Services started:

| Service | Internal port | Nginx path |
|---|---|---|
| `frontend` (Next.js) | 3000 | `/app` |
| `backend` (Drogon C++) | 8080 | `/api` |
| `keycloak` (OIDC SSO) | 8080 | `/sso` |
| `sso` (login shell) | 3000 | `/sso-portal` |
| `portal` (Nginx) | 80 → **8892** | `/` |
| `db` (PostgreSQL) | 5432 | — |
| `keycloak-db` (PostgreSQL) | 5432 | — |
| `elasticsearch` | 9200 | — |
| `redis` | 6379 | — |

---

## Backend (C++ Drogon)

All daemons are subcommands of the `businessplanner-api` binary:

| Subcommand | Compose service | Purpose |
|---|---|---|
| `serve` | `backend` | Main REST API :8080 |
| `migrate` | (one-shot) | Apply SQL migrations |
| `seed` | (one-shot) | Seed demo data |

### Manager CLI

All project automation runs through the C++ manager CLI:

```bash
cd services/manager-cli && make   # build once

./manager build --debug           # Build backend
./manager test                    # Run GTests
./manager lint                    # Check formatting
./manager fmt                     # Auto-format
./manager generate cmake          # Regen CMakeLists.txt
./manager generate models         # Regen ORM models
./manager migrate --up            # Run pending migrations

# User management
./manager user seed               # Hash passwords → INSERT SQL
./manager user reset --user devadmin --password NewPass1
```

---

## Frontend (Next.js 16)

```bash
cd frontend
npm ci
npm run dev          # Dev server (Turbopack), port 3000
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm test             # Jest + React Testing Library
```

The app uses:
- **MUI v6** with a custom M3 token theme (dark/light)
- **Redux Toolkit + RTK Query** for server state
- **next-intl** for i18n (8 locales: en, es, fr, de, ja, zh, nl, cy)
- **Atomic design** — atoms / molecules / organisms under
  `frontend/src/components/`
- **Custom hooks** for all stateful logic (`frontend/src/hooks/`)

All user-facing strings live in `frontend/src/messages/*.json`.
All constant values (URLs, config) in `frontend/src/constants/*.json`.

---

## API Overview

| Group | Base Path | Description |
|---|---|---|
| Auth | `/api/auth` | OIDC session validation |
| Users | `/api/users` | User profiles and stats |
| Preferences | `/api/users/me/preferences` | Theme / locale / AI provider |
| Chat | `/api/chat` | AI advisor (Claude/OpenAI) |
| Search | `/api/search` | Full-text search (Elasticsearch) |
| Dashboard | `/api/dashboard` | Stats overview |
| Health | `/api/health` | Service health check |

---

## Code Conventions

- **Line length**: 80 characters maximum — all files.
- **File size**: 100 lines maximum. Split if approaching limit.
- **No hardcoded strings**: user-facing text in `messages/*.json`;
  config values in `constants/*.json`.
- **C++**: Linux brace style, 4-space indent, C++20, Doxygen comments.
- **TypeScript**: strict mode, single quotes, JSDoc on all exports.
- **CSS**: `100dvh` not `100vh`; no `!important`; overlays need
  `overscroll-behavior: contain`.
- **Debug UI**: gated on `NEXT_PUBLIC_DEBUG_BAR=1`, never
  `NODE_ENV === 'development'`.

Full details in [CLAUDE.md](CLAUDE.md).

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Follow the conventions in [CLAUDE.md](CLAUDE.md).
4. Write tests for new functionality.
5. Run `./manager lint` and `cd frontend && npm run lint`.
6. Open a pull request against `main`.

---

## License

MIT — see [LICENSE](LICENSE).
