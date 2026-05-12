/**
 * Pure computation hook for financial health score.
 * No API calls; results derive from burn + unit econ inputs.
 * @module hooks/useHealthScore
 */
import { useMemo } from 'react';
import type {
  BurnResult,
  UnitEconResult,
  PricingInputs,
  HealthScore,
} from '@/types/financials';
import financialsConstants from
  '@/constants/financials.json';

/**
 * Computes a composite financial health score (0–100).
 *
 * @param burn - Computed BurnResult.
 * @param unitEcon - Computed UnitEconResult.
 * @param pricing - Current PricingInputs (for MRR vs target).
 * @returns HealthScore with overall score and sub-scores.
 *
 * @example
 * const health = useHealthScore(burnResult, unitResult, p);
 */
export function useHealthScore(
  burn: BurnResult,
  unitEcon: UnitEconResult,
  pricing: PricingInputs,
): HealthScore {
  return useMemo(() => {
    const w = financialsConstants.healthWeights;

    // Runway sub-score
    const rm = isFinite(burn.runway_months)
      ? burn.runway_months
      : 999;
    const runway_score =
      rm >= 12 ? 100 : rm >= 6 ? 70 : rm >= 3 ? 40 : 0;

    // LTV:CAC sub-score
    const ratio = isFinite(unitEcon.ltv_cac_ratio)
      ? unitEcon.ltv_cac_ratio
      : 999;
    const ltv_cac_score =
      ratio >= 3 ? 100 : ratio >= 1 ? 60 : 20;

    // Churn sub-score — derived from unit econ status
    const churn_score =
      unitEcon.status === 'good'
        ? 100
        : unitEcon.status === 'warn'
          ? 60
          : 20;

    // MRR sub-score
    const currentMrr =
      pricing.initial_customers * pricing.price_gbp;
    const targetMrr = pricing.target_mrr_gbp;
    const mrr_score =
      targetMrr <= 0
        ? 100
        : currentMrr >= targetMrr
          ? 100
          : currentMrr >= targetMrr * 0.5
            ? 60
            : 20;

    const score = Math.round(
      (runway_score * w.runway +
        ltv_cac_score * w.ltvCac +
        churn_score * w.churn +
        mrr_score * w.mrr) /
        (w.runway + w.ltvCac + w.churn + w.mrr),
    );

    const label: HealthScore['label'] =
      score >= 70
        ? 'Healthy'
        : score >= 40
          ? 'Caution'
          : 'At Risk';

    return {
      score,
      runway_score,
      ltv_cac_score,
      churn_score,
      mrr_score,
      label,
    };
  }, [burn, unitEcon, pricing]);
}
