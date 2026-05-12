/**
 * Analytics type definitions.
 * @module types/analytics
 */

/**
 * LaunchPad-specific KPI metrics returned by
 * GET /api/analytics/launchpad.
 */
export interface LaunchPadMetrics {
  /** Distinct founders active in the last 7 days. */
  weeklyActiveFounders: number;
  /** Percentage of registered users with streak > 0. */
  streakRetentionPct: number;
  /** Total registered founders. */
  totalFounders: number;
  /** Total financial hypotheses tracked. */
  hypothesesTotal: number;
  /** Hypotheses with status "validated". */
  hypothesesValidated: number;
  /** ISO-8601 timestamp when the payload was built. */
  generatedAt: string;
}

/**
 * A single metric item from
 * GET /api/analytics/summary.
 */
export interface MetricSummaryItem {
  /** Metric identifier key. */
  key: string;
  /** Human-readable label. */
  label: string;
  /** Material icon name. */
  icon: string;
  /** Aggregate total count. */
  total: number;
  /** True when the underlying table is absent. */
  missing: boolean;
}
