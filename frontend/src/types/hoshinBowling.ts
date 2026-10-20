/**
 * @file hoshinBowling.ts
 * @brief TypeScript types for the bowling chart
 *        sub-domain of Hoshin Kanri.
 */

/** Month cell status. */
export type BowlingStatus =
  | 'not-started'
  | 'in-progress'
  | 'achieved'
  | 'missed';

/**
 * A single month cell within a bowling objective.
 */
export interface BowlingMonth {
  /** UUID of this month record. */
  id: string;
  /** Calendar month (1–12). */
  month: number;
  /** 4-digit year. */
  year: number;
  /** Traffic-light status. */
  status: BowlingStatus;
  /** Actual measured value. */
  actual: number;
  /** Target value for this month. */
  target: number;
}

/**
 * A bowling objective row with month cells.
 */
export interface BowlingObjective {
  /** UUID of this objective. */
  id: string;
  /** Display title. */
  title: string;
  /** Sort position (ascending). */
  sort_order: number;
  /** Month cells — may be sparse (empty months omitted). */
  months: BowlingMonth[];
}

/**
 * Payload for creating a bowling objective.
 */
export interface CreateBowlingObjectiveInput {
  title: string;
}

/**
 * Payload for upserting a month cell.
 */
export interface UpsertBowlingMonthInput {
  month: number;
  year: number;
  status: BowlingStatus;
  actual: number;
  target: number;
}
