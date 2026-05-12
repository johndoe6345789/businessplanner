/**
 * Pure computation hook for unit economics metrics.
 * No API calls; results derive from inputs only.
 * @module hooks/useUnitEconCompute
 */
import { useMemo } from 'react';
import type {
  UnitEconInputs,
  UnitEconResult,
} from '@/types/financials';
import financialsConstants from
  '@/constants/financials.json';

/**
 * Computes LTV, LTV:CAC, payback months, and gross margin.
 *
 * @param inputs - UnitEconInputs with CAC, ARPU, churn, COGS.
 * @returns UnitEconResult with all computed metrics.
 *
 * @example
 * const result = useUnitEconCompute({
 *   cac_gbp: 300,
 *   arpu_gbp: 50,
 *   churn_pct: 5,
 *   cogs_pct: 20,
 * });
 */
export function useUnitEconCompute(
  inputs: UnitEconInputs,
): UnitEconResult {
  return useMemo(() => {
    const { cac_gbp, arpu_gbp, churn_pct, cogs_pct } = inputs;

    const gross_margin_pct = 100 - cogs_pct;
    const grossMarginFrac = gross_margin_pct / 100;
    const churnFrac = churn_pct / 100;

    const ltv_gbp =
      churnFrac > 0
        ? (arpu_gbp * grossMarginFrac) / churnFrac
        : Infinity;

    const ltv_cac_ratio =
      cac_gbp > 0 ? ltv_gbp / cac_gbp : Infinity;

    const payback_months =
      arpu_gbp * grossMarginFrac > 0
        ? cac_gbp / (arpu_gbp * grossMarginFrac)
        : Infinity;

    const { good, warn } = financialsConstants.ltvCac;
    let status: UnitEconResult['status'];
    if (ltv_cac_ratio >= good) {
      status = 'good';
    } else if (ltv_cac_ratio >= warn) {
      status = 'warn';
    } else {
      status = 'poor';
    }

    return {
      ltv_gbp,
      ltv_cac_ratio,
      payback_months,
      gross_margin_pct,
      status,
    };
  }, [inputs]);
}
