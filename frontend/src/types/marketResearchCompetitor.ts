/**
 * Market research Competitor types.
 * @module types/marketResearchCompetitor
 */

/** A tracked competitor entry. */
export interface Competitor {
  /** Unique identifier. */
  id: string;
  /** Owning user identifier. */
  userId: string;
  /** Company name. */
  name: string;
  /** Company website URL. */
  website: string;
  /** Company stage (e.g. early, growth, enterprise). */
  stage: string;
  /** List of competitor strengths. */
  strengths: string[];
  /** List of competitor weaknesses. */
  weaknesses: string[];
  /** Feature comparison map. */
  features: Record<string, boolean>;
  /** Free-text notes. */
  notes: string;
}

/** Input payload for creating a competitor. */
export interface CreateCompetitorInput {
  /** Company name. */
  name: string;
  /** Company website URL. */
  website: string;
  /** Company stage. */
  stage: string;
  /** List of competitor strengths. */
  strengths: string[];
  /** List of competitor weaknesses. */
  weaknesses: string[];
  /** Feature comparison map. */
  features: Record<string, boolean>;
  /** Free-text notes. */
  notes: string;
}
