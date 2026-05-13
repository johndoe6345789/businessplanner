-- 004_kb_content_seeds.sql
-- Knowledge-base article stubs for legal and market
-- research sections (roadmap items 3.1-3.4, 3.7-3.8,
-- 4.5, 4.6).
--
-- tenant_id uses a well-known LaunchPad platform UUID.
-- created_by / updated_by are left NULL (system seed).
-- Slug convention: {startup_type}.{kb_type}.{stage}.{slug}
-- For cross-type guides, startup_type is NULL and the
-- slug omits the startup_type prefix.
--
-- INSERT … ON CONFLICT DO NOTHING makes this migration
-- safe to run more than once.

DO $$
DECLARE
    tid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN

-- 3.1: Business Structure Guide
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'legal.guide.legal.business-structure',
    'Business Structure Guide',
    E'# Business Structure Guide\n\n'
    'Choose between Sole Trader, LLP, and Ltd.\n\n'
    '## Sole Trader\nSimplest to set up. Personal '
    'liability unlimited.\n\n'
    '## LLP\nLimited liability for partners. '
    'Good for professional firms.\n\n'
    '## Ltd (Private Limited Company)\nSeparate '
    'legal entity. Required for VC funding.',
    'legal.guide.legal.business-structure',
    4,
    'guide', NULL, 'legal',
    ARRAY['legal','structure','company-type']
) ON CONFLICT DO NOTHING;

-- 3.2: Company Registration Checklist
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'legal.checklist.legal.company-registration',
    'Company Registration Checklist',
    E'# Company Registration Checklist\n\n'
    '- [ ] Choose company name\n'
    '- [ ] File with Companies House (UK) '
    'or Secretary of State (US)\n'
    '- [ ] Obtain EIN / UTR\n'
    '- [ ] Open business bank account\n'
    '- [ ] Register for VAT if applicable',
    'legal.checklist.legal.company-registration',
    4,
    'checklist', NULL, 'legal',
    ARRAY['legal','registration','checklist']
) ON CONFLICT DO NOTHING;

-- 3.3: IP Primer
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'legal.guide.legal.ip-primer',
    'IP Primer: Trademark, Patent, Copyright',
    E'# IP Primer\n\n'
    '## Trademark\nProtects brand names and logos.\n\n'
    '## Patent\nProtects novel inventions. '
    'File a provisional to lock priority date.\n\n'
    '## Copyright\nAutomatic for written works, '
    'code, and designs.',
    'legal.guide.legal.ip-primer',
    4,
    'guide', NULL, 'legal',
    ARRAY['legal','ip','trademark','patent']
) ON CONFLICT DO NOTHING;

-- 3.4: Founder Agreement Checklist
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'legal.checklist.legal.founder-agreement',
    'Founder Agreement Checklist',
    E'# Founder Agreement Checklist\n\n'
    '- [ ] Equity split documented\n'
    '- [ ] Vesting schedule agreed (4yr/1yr cliff)\n'
    '- [ ] IP assignment clauses\n'
    '- [ ] Decision-making rules\n'
    '- [ ] Exit / buyout provisions',
    'legal.checklist.legal.founder-agreement',
    4,
    'checklist', NULL, 'legal',
    ARRAY['legal','founders','equity','agreement']
) ON CONFLICT DO NOTHING;

-- 3.7: Advisor Equity Guide
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'legal.guide.legal.advisor-equity',
    'Advisor Equity Guide',
    E'# Advisor Equity Guide\n\n'
    'Typical advisor grants: 0.1%–0.5% over 2 years '
    'with a 6-month cliff.\n\n'
    'Use a simple advisor agreement (FAST template). '
    'Document expected time commitment.',
    'legal.guide.legal.advisor-equity',
    4,
    'guide', NULL, 'legal',
    ARRAY['legal','advisors','equity']
) ON CONFLICT DO NOTHING;

-- 3.8: GDPR Basics
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'legal.guide.legal.gdpr-basics',
    'GDPR Basics for Product Builders',
    E'# GDPR Basics for Product Builders\n\n'
    '- Collect only what you need (data minimisation)\n'
    '- Provide a privacy policy\n'
    '- Enable user data deletion\n'
    '- Appoint a DPA contact if processing EU data\n'
    '- Cookie consent for analytics',
    'legal.guide.legal.gdpr-basics',
    4,
    'guide', NULL, 'legal',
    ARRAY['legal','gdpr','privacy','compliance']
) ON CONFLICT DO NOTHING;

-- 4.5: Customer Interview Script Templates
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'guide.template.validate.customer-interview-script',
    'Customer Interview Script Templates',
    E'# Customer Interview Script Templates\n\n'
    '## Opening\n"Tell me about the last time you '
    'experienced [problem]."\n\n'
    '## Probing\n"How do you solve it today?"\n'
    '"What does it cost you?"\n\n'
    '## Closing\n"Who else should I speak to?"',
    'guide.template.validate.customer-interview-script',
    4,
    'template', NULL, 'validate',
    ARRAY['research','interviews','discovery','validate']
) ON CONFLICT DO NOTHING;

-- 4.6: Industry Benchmark Reference
INSERT INTO wiki_pages
    (tenant_id, slug, title, body_md, path, depth,
     kb_type, startup_type, stage, tags)
VALUES (
    tid,
    'benchmark.benchmark.validate.industry-benchmarks',
    'Industry Benchmark Reference',
    E'# Industry Benchmark Reference\n\n'
    '| Type | Typical CAC | LTV:CAC | Churn |\n'
    '|------|-------------|---------|-------|\n'
    '| SaaS | $300–$800   | 3:1+    | <2%/mo|\n'
    '| Marketplace | $50–$200 | 5:1+ | <5%/mo|\n'
    '| eCommerce | $20–$80 | 2:1+ | 5–8%/mo|\n'
    '| Services | $500–$2k | 4:1+ | <3%/mo|',
    'benchmark.benchmark.validate.industry-benchmarks',
    4,
    'benchmark', NULL, 'validate',
    ARRAY['benchmarks','cac','ltv','market-research']
) ON CONFLICT DO NOTHING;

END $$;
