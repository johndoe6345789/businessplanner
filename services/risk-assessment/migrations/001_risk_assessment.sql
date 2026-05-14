-- Migration: 001_risk_assessment
-- Domain: risk-assessment
-- Creates the risks table.

CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL
        CHECK (category IN (
            'market', 'financial', 'operational',
            'legal', 'technical'
        )),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    probability INT NOT NULL
        CHECK (probability BETWEEN 1 AND 5),
    impact INT NOT NULL
        CHECK (impact BETWEEN 1 AND 5),
    risk_score INT GENERATED ALWAYS AS
        (probability * impact) STORED,
    mitigation_strategy TEXT NOT NULL DEFAULT '',
    owner TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN (
            'open', 'mitigating', 'closed'
        )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risks_user_id
    ON risks (user_id);

CREATE INDEX idx_risks_risk_score
    ON risks (risk_score DESC);

-- Example seed rows (demo user placeholder):
-- INSERT INTO risks
--   (user_id, category, title, description,
--    probability, impact,
--    mitigation_strategy, owner, status)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001',
--    'market', 'Market saturation',
--    'Target market may already be saturated.',
--    3, 4, 'Differentiate via niche targeting.',
--    'CEO', 'open'),
--   ('00000000-0000-0000-0000-000000000001',
--    'financial', 'Runway risk',
--    'Cash runway may fall below 6 months.',
--    2, 5, 'Accelerate revenue milestones.',
--    'CFO', 'mitigating'),
--   ('00000000-0000-0000-0000-000000000001',
--    'technical', 'API rate limits',
--    'Third-party API quotas may block scaling.',
--    2, 3, 'Implement local caching layer.',
--    'CTO', 'open');
