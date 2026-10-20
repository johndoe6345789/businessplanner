import { renderHook } from '@testing-library/react';
import { useHealthScore } from '../useHealthScore';
import type {
  BurnResult, UnitEconResult, PricingInputs,
} from '@/types/financials';

const BURN_SAFE: BurnResult = {
  net_burn_gbp: 1_000, runway_months: 24, status: 'safe',
};
const UNIT_GOOD: UnitEconResult = {
  ltv_gbp: 3_000, ltv_cac_ratio: 10,
  payback_months: 2, gross_margin_pct: 80, status: 'good',
};
const PRICING: PricingInputs = {
  price_gbp: 50, target_mrr_gbp: 5_000,
  initial_customers: 100, monthly_growth_pct: 10,
  revenue_model: 'subscription', notes: '',
};

describe('useHealthScore', () => {
  it('scores 100 for runway_score when runway >= 12', () => {
    const { result } = renderHook(() =>
      useHealthScore(BURN_SAFE, UNIT_GOOD, PRICING));
    expect(result.current.runway_score).toBe(100);
  });

  it('scores 70 for runway when 6 <= months < 12', () => {
    const burn: BurnResult = {
      ...BURN_SAFE, runway_months: 8,
    };
    const { result } = renderHook(() =>
      useHealthScore(burn, UNIT_GOOD, PRICING));
    expect(result.current.runway_score).toBe(70);
  });

  it('scores 0 for runway when months < 3', () => {
    const burn: BurnResult = {
      ...BURN_SAFE, runway_months: 1,
    };
    const { result } = renderHook(() =>
      useHealthScore(burn, UNIT_GOOD, PRICING));
    expect(result.current.runway_score).toBe(0);
  });

  it('scores 100 for ltv_cac_score when ratio >= 3', () => {
    const { result } = renderHook(() =>
      useHealthScore(BURN_SAFE, UNIT_GOOD, PRICING));
    expect(result.current.ltv_cac_score).toBe(100);
  });

  it('scores 20 for ltv_cac when ratio < 1', () => {
    const unit: UnitEconResult = {
      ...UNIT_GOOD, ltv_cac_ratio: 0.5,
    };
    const { result } = renderHook(() =>
      useHealthScore(BURN_SAFE, unit, PRICING));
    expect(result.current.ltv_cac_score).toBe(20);
  });

  it('scores 100 for mrr when target is 0', () => {
    const pricing: PricingInputs = {
      ...PRICING, target_mrr_gbp: 0,
    };
    const { result } = renderHook(() =>
      useHealthScore(BURN_SAFE, UNIT_GOOD, pricing));
    expect(result.current.mrr_score).toBe(100);
  });

  it('label is Healthy when score >= 70', () => {
    const { result } = renderHook(() =>
      useHealthScore(BURN_SAFE, UNIT_GOOD, PRICING));
    expect(result.current.label).toBe('Healthy');
  });

  it('label is At Risk when score < 40', () => {
    const burn: BurnResult = {
      ...BURN_SAFE, runway_months: 1,
    };
    const unit: UnitEconResult = {
      ...UNIT_GOOD, ltv_cac_ratio: 0.2,
    };
    const pricing: PricingInputs = {
      ...PRICING, initial_customers: 1,
      target_mrr_gbp: 100_000,
    };
    const { result } = renderHook(() =>
      useHealthScore(burn, unit, pricing));
    expect(result.current.label).toBe('At Risk');
  });
});
