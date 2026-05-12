/**
 * Knowledge base domain types.
 * @module types/knowledge
 */

/** A single KB article as returned by the API. */
export interface KbArticle {
  /** Internal article identifier. */
  id: number;
  /** Display title of the article. */
  title: string;
  /** URL-safe slug for the article. */
  slug: string;
  /** Wiki page path used to retrieve full content. */
  path: string;
  /** Category of this KB article. */
  kbType: string;
  /** Startup archetype slug this article targets. */
  startupType: string | null;
  /** Lifecycle stage slug this article targets. */
  stage: string | null;
  /** Searchable tag list. */
  tags: string[];
  /** ISO-8601 timestamp of the last update. */
  updatedAt: string;
}

/** Allowed knowledge-base content categories. */
export type KbType =
  | 'guide'
  | 'playbook'
  | 'benchmark'
  | 'legal'
  | 'template'
  | 'checklist';
