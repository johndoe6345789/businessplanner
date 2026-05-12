/**
 * Hypothesis, kill criteria, and health score types.
 * @module types/financialsMisc
 */

/** A single financial hypothesis entry. */
export interface FinancialHypothesis {
  /** Unique identifier. */
  id: string;
  /** The assumption being tested. */
  assumption: string;
  /** How it will be validated. */
  test_method: string;
  /** Outcome of the test. */
  result: string;
  /** Current validation status. */
  status: 'untested' | 'validated' | 'invalidated';
  /** ISO creation timestamp. */
  created_at: string;
  /** ISO last-updated timestamp. */
  updated_at: string;
}

/** Kill criteria thresholds for the venture. */
export interface KillCriteria {
  /** Minimum acceptable runway in months. */
  runway_months_min: number;
  /** Minimum acceptable LTV:CAC ratio. */
  cac_ltv_ratio_min: number;
  /** Minimum weekly active users. */
  weekly_active_users_min: number;
  /** Freeform custom criteria list. */
  custom_criteria: { label: string; met: boolean }[];
}

/** Composite financial health score. */
export interface HealthScore {
  /** Overall score 0–100. */
  score: number;
  /** Runway sub-score 0–100. */
  runway_score: number;
  /** LTV:CAC sub-score 0–100. */
  ltv_cac_score: number;
  /** Churn sub-score 0–100. */
  churn_score: number;
  /** MRR vs target sub-score 0–100. */
  mrr_score: number;
  /** Human-readable health label. */
  label: 'Healthy' | 'Caution' | 'At Risk';
}
