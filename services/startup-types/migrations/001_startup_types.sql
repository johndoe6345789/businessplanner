-- 001_startup_types.sql
-- Startup-type reference data: types, per-type
-- stages, and common traps. Read-only from the
-- API; edited by admins via migrations only.

CREATE TABLE startup_types (
    slug        TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT NOT NULL,
    icon        TEXT NOT NULL DEFAULT '🚀',
    sort_order  INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE startup_type_stages (
    startup_type_slug TEXT NOT NULL
        REFERENCES startup_types(slug)
        ON DELETE CASCADE,
    slug         TEXT NOT NULL,
    name         TEXT NOT NULL,
    description  TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (startup_type_slug, slug)
);

CREATE TABLE startup_type_traps (
    id BIGSERIAL PRIMARY KEY,
    startup_type_slug TEXT NOT NULL
        REFERENCES startup_types(slug)
        ON DELETE CASCADE,
    description  TEXT NOT NULL,
    sort_order   INT NOT NULL DEFAULT 0
);

-- ── Seed: startup_types ───────────────────────
INSERT INTO startup_types
    (slug, name, description, icon, sort_order)
VALUES
  ('saas', 'SaaS',
   'Recurring-revenue software delivered over '
   'the internet. Grow via product-led or '
   'sales-led motion.',
   '💻', 1),
  ('marketplace', 'Marketplace',
   'Two-sided platform connecting buyers and '
   'sellers. Core challenge: solving the '
   'chicken-and-egg problem.',
   '🛒', 2),
  ('ecommerce', 'E-commerce',
   'Selling physical or digital products online.'
   ' Margin, logistics, and CAC are the defining'
   ' constraints.',
   '📦', 3),
  ('hardware', 'Hardware',
   'Physical product startup. Long '
   'design-to-ship cycles and high upfront '
   'manufacturing cost.',
   '⚙️', 4),
  ('services', 'Services',
   'Professional or managed services. Revenue '
   'from expertise and time, not software.',
   '🤝', 5),
  ('fintech', 'Fintech',
   'Financial technology. Regulatory compliance '
   'and banking partnerships are critical-path '
   'blockers.',
   '💳', 6),
  ('health', 'Health',
   'Healthcare or health-tech. Clinical '
   'validation and regulatory approval '
   '(MHRA/FDA) dominate the timeline.',
   '🏥', 7),
  ('content', 'Content',
   'Content or media business. Audience-first, '
   'then monetisation — in that order.',
   '📝', 8),
  ('platform', 'Platform',
   'Developer or B2B platform. Network effects '
   'require a clear core use-case before opening'
   ' to third parties.',
   '🔧', 9);

-- ── Seed: startup_type_stages ─────────────────
-- SaaS
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('saas','ideate','Ideate',
   'Define the problem and potential solution',
   1),
  ('saas','validate','Validate',
   'Talk to 20+ potential customers before '
   'building',
   2),
  ('saas','build-mvp','Build MVP',
   'Narrowest possible working product', 3),
  ('saas','launch','Launch',
   'Get to first 10 paying customers', 4),
  ('saas','grow','Grow',
   'Reduce churn and find a repeatable growth '
   'channel',
   5);

-- Marketplace
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('marketplace','ideate','Ideate',
   'Identify both sides and the transaction to '
   'facilitate',
   1),
  ('marketplace','validate','Validate',
   'Prove demand on one side before building',
   2),
  ('marketplace','seed-supply','Seed Supply',
   'Recruit early supply side manually', 3),
  ('marketplace','build','Build',
   'Core matching and transaction flow', 4),
  ('marketplace','launch','Launch',
   'Controlled launch with curated supply', 5),
  ('marketplace','scale','Scale',
   'Balance supply and demand at volume', 6);

-- E-commerce
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('ecommerce','ideate','Ideate',
   'Find product-market fit and source', 1),
  ('ecommerce','source','Source Product',
   'Validate supplier and margins', 2),
  ('ecommerce','validate','Validate',
   'Sell before you stock — pre-orders or test '
   'listings',
   3),
  ('ecommerce','build-store','Build Store',
   'Full storefront and fulfilment pipeline',
   4),
  ('ecommerce','launch','Launch',
   'First 100 orders', 5),
  ('ecommerce','scale','Scale',
   'Paid acquisition and repeat purchase', 6);

-- Hardware
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('hardware','ideate','Ideate',
   'Problem definition and initial concept', 1),
  ('hardware','design','Design',
   'CAD drawings and bill of materials', 2),
  ('hardware','prototype','Prototype',
   'Functional prototype — not production '
   'quality',
   3),
  ('hardware','validate','Validate',
   'Pre-orders or pilot customers', 4),
  ('hardware','manufacture','Manufacture',
   'Production run and quality control', 5),
  ('hardware','launch','Launch',
   'Fulfilment and customer support', 6);

-- Services
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('services','ideate','Ideate',
   'Define the service and target client', 1),
  ('services','validate','Validate',
   'Land first paying client', 2),
  ('services','systematise','Systematise',
   'Build repeatable delivery processes', 3),
  ('services','scale','Scale',
   'Hire to deliver — reduce founder dependence',
   4);

-- Fintech
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('fintech','ideate','Ideate',
   'Define the financial problem to solve', 1),
  ('fintech','compliance','Compliance',
   'Map regulatory requirements '
   '(FCA/SEC/PSD2)',
   2),
  ('fintech','validate','Validate',
   'Validate with potential customers before '
   'applying for licences',
   3),
  ('fintech','build','Build',
   'Compliant core product with banking '
   'partnerships',
   4),
  ('fintech','launch','Launch',
   'Controlled launch under regulatory '
   'supervision',
   5);

-- Health
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('health','ideate','Ideate',
   'Define the clinical or consumer health '
   'problem',
   1),
  ('health','regulatory','Regulatory Research',
   'Map approval pathway (MHRA/FDA/CE)', 2),
  ('health','validate','Validate',
   'Clinical or user validation study', 3),
  ('health','build','Build',
   'CE-marked or FDA-cleared product', 4),
  ('health','launch','Launch',
   'Limited launch with clinical partners', 5);

-- Content
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('content','ideate','Ideate',
   'Choose niche and content format', 1),
  ('content','build-audience','Build Audience',
   'Consistent publishing — reach 1 000 true '
   'fans',
   2),
  ('content','validate','Validate',
   'Prove audience engagement before '
   'monetising',
   3),
  ('content','monetise','Monetise',
   'First revenue stream', 4),
  ('content','scale','Scale',
   'Second revenue stream + team', 5);

-- Platform
INSERT INTO startup_type_stages
    (startup_type_slug, slug, name,
     description, display_order)
VALUES
  ('platform','ideate','Ideate',
   'Define the core use-case for the first '
   'cohort',
   1),
  ('platform','validate','Validate',
   'Prove value with 10 design partners', 2),
  ('platform','build-core','Build Core',
   'Core platform with APIs', 3),
  ('platform','developer-beta','Developer Beta',
   'Invite 50 developers — measure activation',
   4),
  ('platform','launch','Launch',
   'Public launch with developer ecosystem',
   5);

-- ── Seed: startup_type_traps ──────────────────
INSERT INTO startup_type_traps
    (startup_type_slug, description, sort_order)
VALUES
  ('saas',
   'Building features before validating the '
   'core problem',
   1),
  ('saas',
   'Ignoring churn until Series A', 2),
  ('saas',
   'Pricing too low to signal quality', 3),

  ('marketplace',
   'Building technology before solving '
   'chicken-and-egg manually',
   1),
  ('marketplace',
   'Taking a transaction cut before supply '
   'trusts the platform',
   2),
  ('marketplace',
   'Growing both sides at the same rate — '
   'grow supply first',
   3),

  ('ecommerce',
   'Buying inventory before proving demand via '
   'pre-orders',
   1),
  ('ecommerce',
   'Ignoring contribution margin on first '
   'orders',
   2),
  ('ecommerce',
   'Underestimating fulfilment and returns cost',
   3),

  ('hardware',
   'Underestimating manufacturing cost by 3–5×',
   1),
  ('hardware',
   'Skipping regulatory certification research '
   'until post-prototype',
   2),
  ('hardware',
   'Raising too little for the production run',
   3),

  ('services',
   'Trading time for money with no '
   'productisation plan',
   1),
  ('services',
   'Single-client dependency in year one', 2),
  ('services',
   'Scope creep without a change-control '
   'process',
   3),

  ('fintech',
   'Starting to build before mapping the '
   'regulatory path',
   1),
  ('fintech',
   'Underestimating the time to open a banking '
   'partner account',
   2),
  ('fintech',
   'Launching without a fraud and AML policy',
   3),

  ('health',
   'Starting clinical trials without a '
   'regulatory strategy',
   1),
  ('health',
   'Underestimating MHRA/FDA approval timelines'
   ' by 2–3 years',
   2),
  ('health',
   'Collecting health data without a data '
   'protection officer',
   3),

  ('content',
   'Monetising too early before audience trust '
   'is established',
   1),
  ('content',
   'Depending on a single platform for '
   'distribution',
   2),
  ('content',
   'Producing content without a repeatable '
   'publishing system',
   3),

  ('platform',
   'Opening to developers before the core '
   'use-case is proven',
   1),
  ('platform',
   'Underinvesting in developer experience and '
   'documentation',
   2),
  ('platform',
   'Growing both sides of the platform '
   'simultaneously too early',
   3);
