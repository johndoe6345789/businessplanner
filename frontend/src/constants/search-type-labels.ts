/**
 * Maps backend search-result `type` values to the
 * translation key under the `search.tabs.*`
 * namespace used to label suggest badges and
 * results-page tabs.
 *
 * Keep in sync with:
 *   services/search/backend/UrlBuilder.cpp (typeOf)
 *   services/search/constants.json (indexes[].name)
 *
 * @module constants/search-type-labels
 */

/** Translation-key map for LaunchPad entity types. */
export const TYPE_LABEL_KEY: Record<string, string> = {
  kb_content:      'tabs.knowledge',
  planner_steps:   'tabs.planner',
  community_posts: 'tabs.community',
  founders:        'tabs.founders',
};

/** Tab keys (left → right) on the results page. */
export const RESULT_TABS = [
  'all', 'knowledge', 'planner',
  'community', 'founders',
] as const;

/** Map a tab key to the backend filter[type] value. */
export const TAB_TO_TYPE: Record<string, string> = {
  all:       'all',
  knowledge: 'kb_content',
  planner:   'planner_steps',
  community: 'community_posts',
  founders:  'founders',
};

/** Map ES `_index` → frontend URL prefix. */
export const INDEX_TO_URL_PREFIX:
  Record<string, string> = {
    kb_content:      '/knowledge/',
    planner_steps:   '/planner/',
    community_posts: '/community/threads/',
    founders:        '/u/',
  };
