/**
 * Burn rate and runway financial types.
 * @module types/financialsBurn
 */

/** Inputs for burn rate calculation. */
export interface BurnInputs {
  /** Monthly operational spend in GBP. */
  monthly_burn_gbp: number;
  /** Current cash balance in GBP. */
  cash_in_bank_gbp: number;
  /** Monthly revenue in GBP (£0 is valid — D29). */
  monthly_revenue_gbp: number;
  /** Optional notes. */
  notes: string;
}

/** Computed burn rate metrics. */
export interface BurnResult {
  /** Net burn = monthly_burn − monthly_revenue. */
  net_burn_gbp: number;
  /** Months of runway (Infinity when net_burn ≤ 0). */
  runway_months: number;
  /** Traffic-light status. */
  status: 'safe' | 'warn' | 'critical';
}
