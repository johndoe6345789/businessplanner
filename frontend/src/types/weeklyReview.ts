/**
 * @file weeklyReview.ts
 * @brief Type definitions for the weekly review feature.
 */

/** A saved weekly review record. */
export interface WeeklyReview {
  /** UUID primary key. */
  id: string;
  /** ISO date string for Monday of the review week. */
  week_start: string;
  /** What went well this week. */
  wins: string;
  /** Obstacles encountered this week. */
  challenges: string;
  /** Goals set for next week. */
  next_goals: string;
  /** Founder morale rating 1–5. */
  morale: 1 | 2 | 3 | 4 | 5;
  /** ISO timestamp of record creation. */
  created_at: string;
}

/**
 * Form data for creating or updating a review.
 * Excludes server-generated fields.
 */
export type WeeklyReviewFormData = Omit<
  WeeklyReview,
  'id' | 'created_at'
>;
