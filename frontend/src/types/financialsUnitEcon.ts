/**
 * Unit economics financial types.
 * @module types/financialsUnitEcon
 */

/** Inputs for unit economics calculation. */
export interface UnitEconInputs {
  /** Customer acquisition cost in GBP. */
  cac_gbp: number;
  /** Average revenue per user per month in GBP. */
  arpu_gbp: number;
  /** Monthly churn rate as a percentage (0–100). */
  churn_pct: number;
  /** Cost of goods sold as a percentage of ARPU. */
  cogs_pct: number;
}

/** Computed unit economics metrics. */
export interface UnitEconResult {
  /** Lifetime value in GBP. */
  ltv_gbp: number;
  /** LTV : CAC ratio (Infinity when CAC = 0). */
  ltv_cac_ratio: number;
  /** Months to recover CAC. */
  payback_months: number;
  /** Gross margin as a percentage. */
  gross_margin_pct: number;
  /** Traffic-light status. */
  status: 'good' | 'warn' | 'poor';
}
