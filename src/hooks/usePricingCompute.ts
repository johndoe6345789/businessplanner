/**
 * Pure computation hook for pricing and revenue projections.
 * No API calls; results derive from inputs only.
 * @module hooks/usePricingCompute
 */
import { useMemo } from 'react';
import type {
  PricingInputs,
  RevenueProjection,
} from '@/types/financials';
import financialsConstants from
  '@/constants/financials.json';

/** Output of usePricingCompute. */
export interface PricingComputeResult {
  /** Customers needed to hit target MRR (0 if price = 0). */
  required_customers: number;
  /** 12-month revenue projection rows. */
  projections: RevenueProjection[];
}

/**
 * Computes required customers and 12-month projections.
 *
 * D29: price_gbp of £0 is valid — required_customers is 0
 * and MRR is £0 every month.
 *
 * @param inputs - PricingInputs with price and growth.
 * @returns required_customers and projection rows.
 *
 * @example
 * const { required_customers, projections } =
 *   usePricingCompute({
 *     price_gbp: 49,
 *     target_mrr_gbp: 10000,
 *     initial_customers: 5,
 *     monthly_growth_pct: 10,
 *     revenue_model: 'subscription',
 *     notes: '',
 *   });
 */
export function usePricingCompute(
  inputs: PricingInputs,
): PricingComputeResult {
  return useMemo(() => {
    const {
      price_gbp,
      target_mrr_gbp,
      initial_customers,
      monthly_growth_pct,
    } = inputs;

    const required_customers =
      price_gbp > 0
        ? Math.ceil(target_mrr_gbp / price_gbp)
        : 0;

    const months = financialsConstants.projectionMonths;
    const growthFactor = 1 + monthly_growth_pct / 100;

    const projections: RevenueProjection[] = Array.from(
      { length: months },
      (_, i) => {
        const customers = Math.round(
          initial_customers * Math.pow(growthFactor, i),
        );
        const mrr_gbp = customers * price_gbp;
        return { month: i + 1, customers, mrr_gbp };
      },
    );

    return { required_customers, projections };
  }, [inputs]);
}
