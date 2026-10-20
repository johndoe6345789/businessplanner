/**
 * @file kpi.ts
 * @brief TypeScript types for the KPI scorecard domain.
 */

/** KPI category. */
export type KpiCategory =
  | 'financial'
  | 'customer'
  | 'operational'
  | 'growth';

/** KPI traffic-light status. */
export type KpiStatus =
  | 'on-track'
  | 'at-risk'
  | 'off-track';

/**
 * A single KPI metric returned by the API.
 */
export interface KpiMetric {
  /** UUID of this metric. */
  id: string;
  /** UUID of the owning user. */
  user_id: string;
  /** Display title. */
  title: string;
  /** Domain category. */
  category: KpiCategory;
  /** Current measured value. */
  current_value: number;
  /** Target value for the period. */
  target_value: number;
  /** Baseline value at period start. */
  baseline_value: number;
  /** Unit label (e.g. "£", "%", "users"). */
  unit: string;
  /** Computed traffic-light status. */
  status: KpiStatus;
  /** ISO date — start of the measurement period. */
  period_start: string;
  /** ISO date — end of the measurement period. */
  period_end: string;
  /** ISO timestamp of creation. */
  created_at: string;
  /** ISO timestamp of last update. */
  updated_at: string;
}

/**
 * Payload for creating a KPI metric.
 */
export interface CreateKpiInput {
  title: string;
  category: KpiCategory;
  current_value: number;
  target_value: number;
  baseline_value: number;
  unit: string;
  period_start: string;
  period_end: string;
}

/**
 * Payload for updating the current value of a metric.
 */
export interface UpdateKpiValueInput {
  current_value: number;
}
