-- Migration: 002_hoshin_seed
-- Domain: hoshin
-- Seeds Hoshin Kanri objectives and X-matrix links
-- for the dev admin user (dev.admin@nextra.local).
-- Uses ON CONFLICT guards — safe to re-run.

DO $$
DECLARE
  uid UUID := '686aad67-81b6-4052-b895-2b291bed5565';
  v1  UUID := '11000001-0000-0000-0000-000000000001';
  b1  UUID := '11000001-0000-0000-0000-000000000002';
  b2  UUID := '11000001-0000-0000-0000-000000000003';
  a1  UUID := '11000001-0000-0000-0000-000000000004';
  a2  UUID := '11000001-0000-0000-0000-000000000005';
  a3  UUID := '11000001-0000-0000-0000-000000000006';
BEGIN

-- Vision (5-year north star)
INSERT INTO hoshin_objectives
  (id,user_id,title,description,horizon,
   target_date,sort_order)
VALUES
  (v1,uid,
   'Financial Independence',
   'Replace government benefit income entirely '
   'through compounding startup revenue. '
   'Target: £3k/month net by 2031.',
   'vision','2031-01-01',0)
ON CONFLICT (id) DO NOTHING;

-- Breakthrough objectives (2-3 year)
INSERT INTO hoshin_objectives
  (id,user_id,title,description,horizon,
   target_date,sort_order)
VALUES
  (b1,uid,
   'Reach £1k/month Revenue',
   'Generate at least £1,000/month from one or '
   'more Tier 1-2 startups within 18 months.',
   'breakthrough','2027-12-01',0),
  (b2,uid,
   'Build Compound Chain to Tier 4',
   'Reinvest profits to fund a Tier 3-4 startup '
   '(£3k+ investment) without external funding.',
   'breakthrough','2028-06-01',1)
ON CONFLICT (id) DO NOTHING;

-- Annual objectives (6-12 month)
INSERT INTO hoshin_objectives
  (id,user_id,title,description,horizon,
   target_date,sort_order)
VALUES
  (a1,uid,
   'Launch First Paid Gig',
   'Generate first £1 from Fiverr or dog walking '
   'within 4 weeks of starting.',
   'annual','2026-06-01',0),
  (a2,uid,
   'Hit £300/month from Tier 1',
   'Reach £300/month combined from zero-cost '
   'startups funded by benefit income alone.',
   'annual','2026-09-01',1),
  (a3,uid,
   'Deploy First Compound Investment',
   'Use Tier 1 profits to fund a Tier 2 startup '
   '(eBay Flip → PrintDrop or MobiWash).',
   'annual','2026-12-01',2)
ON CONFLICT (id) DO NOTHING;

-- X-matrix links: Annual obj → Tier 1 startups
INSERT INTO hoshin_links
  (objective_id,organisation_id,strength)
VALUES
  -- a1: Launch First Paid Gig
  (a1,'00000001-0000-0000-0000-000000000001','strong'),
  (a1,'00000001-0000-0000-0000-000000000005','strong'),
  (a1,'00000001-0000-0000-0000-000000000010','medium'),
  -- a2: £300/month from Tier 1
  (a2,'00000001-0000-0000-0000-000000000002','strong'),
  (a2,'00000001-0000-0000-0000-000000000007','strong'),
  (a2,'00000001-0000-0000-0000-000000000010','strong'),
  (a2,'00000001-0000-0000-0000-000000000003','medium'),
  -- a3: First compound investment
  (a3,'00000001-0000-0000-0000-000000000006','strong'),
  (a3,'00000001-0000-0000-0000-000000000011','strong'),
  (a3,'00000001-0000-0000-0000-000000000015','medium'),
  -- b1: £1k/month
  (b1,'00000001-0000-0000-0000-000000000007','strong'),
  (b1,'00000001-0000-0000-0000-000000000015','strong'),
  (b1,'00000001-0000-0000-0000-000000000025','medium'),
  -- b2: Tier 4 compound
  (b2,'00000001-0000-0000-0000-000000000021','strong'),
  (b2,'00000001-0000-0000-0000-000000000040','medium'),
  (b2,'00000001-0000-0000-0000-000000000041','weak'),
  -- vision: everything feeds it
  (v1,'00000001-0000-0000-0000-000000000041','strong'),
  (v1,'00000001-0000-0000-0000-000000000044','medium'),
  (v1,'00000001-0000-0000-0000-000000000033','medium')
ON CONFLICT (objective_id,organisation_id) DO NOTHING;

END $$;
