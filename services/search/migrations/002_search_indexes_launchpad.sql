-- 002_search_indexes_launchpad.sql
-- Replace template-era indexes in the registry with
-- the 4 LaunchPad content domains.
--
-- The nextra-* indexes (forum, wiki, blog, products,
-- gallery, users) are template defaults not used by
-- LaunchPad. This migration removes them and registers
-- the 4 LaunchPad indexes that the search-indexer
-- daemon will maintain going forward.

DELETE FROM search_indexes
 WHERE name IN (
    'forum_posts', 'wiki_pages', 'articles',
    'products', 'gallery_items', 'users'
 );

INSERT INTO search_indexes (name, target_table, es_index)
VALUES
    ('kb_content',
     'kb_content',
     'launchpad-kb'),
    ('planner_steps',
     'planner_steps',
     'launchpad-planner'),
    ('community_posts',
     'comments_v2',
     'launchpad-community'),
    ('founders',
     'users',
     'launchpad-founders')
ON CONFLICT (name) DO UPDATE
   SET target_table = EXCLUDED.target_table,
       es_index     = EXCLUDED.es_index,
       updated_at   = now();
