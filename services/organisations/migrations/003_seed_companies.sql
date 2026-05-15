-- Migration: 003_seed_companies
-- Domain: organisations
-- Seeds 50 startup companies, startup steps, and
-- risk entries for the dev admin user.
-- All inserts use ON CONFLICT DO NOTHING —
-- safe to run against a pre-seeded database.

-- Convenience alias
DO $$ BEGIN
  PERFORM 1 FROM users
  WHERE id='686aad67-81b6-4052-b895-2b291bed5565';
  IF NOT FOUND THEN
    RAISE NOTICE 'Dev user not found; skipping seed.';
    RETURN;
  END IF;
END $$;

-- =============================================
-- TIER 1: £0-300 — Start today
-- =============================================
INSERT INTO organisations
 (id,user_id,name,description,entity_types,
  tags,website,notes,
  initial_investment_gbp,weeks_to_bootstrap,
  monthly_revenue_gbp)
VALUES
('00000001-0000-0000-0000-000000000001',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'Fiverr Gig Studio',
 'Sell graphic design and social media posts on '
 'Fiverr. Zero equipment needed.',
 '{other}','{tier1,digital,freelance}','','',
 0,1,250),
('00000001-0000-0000-0000-000000000002',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'Virtual Assistant HQ',
 'Remote admin support and inbox management '
 'for small business owners.',
 '{other}','{tier1,digital,service}','','',
 0,2,450),
('00000001-0000-0000-0000-000000000003',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'ProofreadPro',
 'Proofread CVs, essays, and business documents '
 'for students and professionals.',
 '{other}','{tier1,digital,writing}','','',
 0,1,300),
('00000001-0000-0000-0000-000000000004',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'TranscribeUK',
 'Transcribe audio interviews and podcasts. '
 'Fully remote, zero startup cost.',
 '{other}','{tier1,digital,audio}','','',
 0,1,280),
('00000001-0000-0000-0000-000000000005',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'Dog Walking Daily',
 'Walk dogs locally. Build recurring clients '
 'via Facebook groups and Nextdoor.',
 '{other}','{tier1,local,pets}','','',
 50,1,600),
('00000001-0000-0000-0000-000000000006',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'eBay Flip Co',
 'Buy cheap at charity shops, resell on eBay. '
 'Pure arbitrage.',
 '{other}','{tier1,ecommerce,reselling}','','',
 100,2,400),
('00000001-0000-0000-0000-000000000007',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'Sparkle Clean',
 'Domestic cleaning for busy professionals. '
 'Build weekly recurring clients.',
 '{other}','{tier1,local,service}','','',
 150,2,900),
('00000001-0000-0000-0000-000000000008',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'GreenThumb Lawn',
 'Lawn mowing and garden tidying for residential '
 'customers.',
 '{other}','{tier1,local,outdoor}','','',
 200,3,750),
('00000001-0000-0000-0000-000000000009',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'Social Sprout',
 'Manage Instagram and TikTok for local '
 'businesses that have no time.',
 '{other}','{tier1,digital,social}','','',
 0,3,400),
('00000001-0000-0000-0000-000000000010',
 '686aad67-81b6-4052-b895-2b291bed5565',
 'TutorMatch UK',
 'Online tutoring for GCSE/A-Level via Zoom. '
 'High demand year-round.',
 '{other}','{tier1,education,remote}','','',
 0,1,600)
ON CONFLICT (id) DO NOTHING;
