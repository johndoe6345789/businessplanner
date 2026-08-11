# 🚀 LaunchPad

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A step-by-step startup company setup guide — six phases from idea to first paying customer. Built on the same Next.js + C++ Drogon domain-sliced monorepo template as [Nextra](https://github.com/johndoe6345789/next_extra_primary), plus its own strategy/business-planning domains.

**Status**: Being split into many single-purpose repos — see [reposplit](https://github.com/johndoe6345789/reposplit) for the full breakdown of what moved where and why.

## What's Left Here

`services/`, `shared/`, and `frontend/` have all been migrated out. What remains is build/deploy tooling: `cmake/`, `docker/`, `deploy/`, Conan build scripts, and `docs/`.

## Where Everything Went

See the [reposplit README](https://github.com/johndoe6345789/reposplit#readme) for the full mapping. Services shared with `next_extra_primary` (auth, gamification, social, ecommerce, etc.) were already migrated via that repo as the canonical source — this repo's copies were redundant duplicates. LaunchPad-specific domains:

- `frontend/` → [launchpad-frontend](https://github.com/johndoe6345789/launchpad-frontend)
- Strategy execution (`hoshin`, `okr`, `pdca`, `pivot`, `decisions`, `weekly-review`, `scoping`, `kpi`) → [strategy-execution-p](https://github.com/johndoe6345789/strategy-execution-p)
- Billing + payroll (`financials`, `xero`, `zelt`) → [workforce-pay-bill-p](https://github.com/johndoe6345789/workforce-pay-bill-p)
- `gdpr` → [gdpr](https://github.com/johndoe6345789/gdpr)
- `legal-team` → [legal-team](https://github.com/johndoe6345789/legal-team)
- `market-research` → [market-research](https://github.com/johndoe6345789/market-research)
- `risk-assessment` → [risk-assessment](https://github.com/johndoe6345789/risk-assessment)
- `startup-types` → [startup-types](https://github.com/johndoe6345789/startup-types)
- `accelerators` → [accelerators](https://github.com/johndoe6345789/accelerators)
- `organisations` → [organisations](https://github.com/johndoe6345789/organisations)
