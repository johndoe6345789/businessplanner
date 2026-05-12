/**
 * Pricing and revenue projection financial types.
 * @module types/financialsPricing
 */

/** Inputs for pricing and revenue model. */
export interface PricingInputs {
  /** Selected revenue model identifier. */
  revenue_model: string;
  /** Price per customer per month in GBP. */
  price_gbp: number;
  /** Target monthly recurring revenue in GBP. */
  target_mrr_gbp: number;
  /** Customers at month 0. */
  initial_customers: number;
  /** Monthly growth rate as a percentage. */
  monthly_growth_pct: number;
  /** Optional notes. */
  notes: string;
}

/** Single month revenue projection row. */
export interface RevenueProjection {
  /** Month index (1-based). */
  month: number;
  /** Projected customer count. */
  customers: number;
  /** Projected MRR in GBP. */
  mrr_gbp: number;
}

/** Supported revenue model identifiers. */
export type RevenueModel =
  | 'subscription'
  | 'freemium'
  | 'usage'
  | 'transactional'
  | 'marketplace';
