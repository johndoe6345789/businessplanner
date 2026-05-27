import { renderHook } from '@testing-library/react';
import { usePricingCompute } from '../usePricingCompute';
import type { PricingInputs } from '@/types/financials';

const BASE: PricingInputs = {
  price_gbp: 0,
  target_mrr_gbp: 0,
  initial_customers: 0,
  monthly_growth_pct: 0,
  revenue_model: 'subscription',
  notes: '',
};

describe('usePricingCompute', () => {
  it('required_customers is 0 when price is 0', () => {
    const { result } = renderHook(() =>
      usePricingCompute({
        ...BASE, price_gbp: 0, target_mrr_gbp: 10_000,
      }),
    );
    expect(result.current.required_customers).toBe(0);
  });

  it('computes required customers as ceil(mrr / price)', () => {
    const { result } = renderHook(() =>
      usePricingCompute({
        ...BASE, price_gbp: 49, target_mrr_gbp: 10_000,
      }),
    );
    // ceil(10000/49) = ceil(204.08) = 205
    expect(result.current.required_customers).toBe(205);
  });

  it('projections has 12 entries', () => {
    const { result } = renderHook(() =>
      usePricingCompute({
        ...BASE, price_gbp: 10, initial_customers: 5,
      }),
    );
    expect(result.current.projections).toHaveLength(12);
  });

  it('first projection month is 1', () => {
    const { result } = renderHook(() =>
      usePricingCompute({
        ...BASE, price_gbp: 10, initial_customers: 5,
      }),
    );
    expect(result.current.projections[0].month).toBe(1);
  });

  it('mrr is customers * price in month 1', () => {
    const { result } = renderHook(() =>
      usePricingCompute({
        ...BASE,
        price_gbp: 20,
        initial_customers: 10,
        monthly_growth_pct: 0,
      }),
    );
    expect(result.current.projections[0].mrr_gbp).toBe(200);
  });

  it('customers grow with monthly_growth_pct', () => {
    const { result } = renderHook(() =>
      usePricingCompute({
        ...BASE,
        price_gbp: 10,
        initial_customers: 100,
        monthly_growth_pct: 10,
      }),
    );
    // month 2: 100 * 1.1^1 = 110
    expect(result.current.projections[1].customers).toBe(110);
  });

  it('zero growth keeps customers constant', () => {
    const { result } = renderHook(() =>
      usePricingCompute({
        ...BASE,
        price_gbp: 10,
        initial_customers: 50,
        monthly_growth_pct: 0,
      }),
    );
    const counts = result.current.projections.map(
      (p) => p.customers,
    );
    expect(counts.every((c) => c === 50)).toBe(true);
  });
});
