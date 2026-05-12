/**
 * Pure computation hook for burn rate and runway.
 * No API calls are made; results derive from inputs only.
 * @module hooks/useBurnCompute
 */
import { useMemo } from 'react';
import type {
  BurnInputs,
  BurnResult,
} from '@/types/financials';
import financialsConstants from
  '@/constants/financials.json';

/**
 * Computes net burn, runway, and status from raw inputs.
 *
 * D29: monthly_revenue_gbp of £0 is fully valid; it simply
 * means net_burn equals monthly_burn_gbp.
 *
 * @param inputs - BurnInputs with burn, cash, and revenue.
 * @returns BurnResult with net_burn, runway_months, status.
 *
 * @example
 * const result = useBurnCompute({
 *   monthly_burn_gbp: 10000,
 *   cash_in_bank_gbp: 50000,
 *   monthly_revenue_gbp: 0,
 *   notes: '',
 * });
 */
export function useBurnCompute(inputs: BurnInputs): BurnResult {
  return useMemo(() => {
    const {
      monthly_burn_gbp,
      cash_in_bank_gbp,
      monthly_revenue_gbp,
    } = inputs;

    const net_burn_gbp = monthly_burn_gbp - monthly_revenue_gbp;

    const runway_months =
      net_burn_gbp <= 0
        ? Infinity
        : cash_in_bank_gbp / net_burn_gbp;

    const { safe, warn } = financialsConstants.runway;
    let status: BurnResult['status'];
    if (runway_months > safe) {
      status = 'safe';
    } else if (runway_months >= warn) {
      status = 'warn';
    } else {
      status = 'critical';
    }

    return { net_burn_gbp, runway_months, status };
  }, [inputs]);
}
