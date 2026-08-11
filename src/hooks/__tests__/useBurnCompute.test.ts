import { renderHook } from '@testing-library/react';
import { useBurnCompute } from '../useBurnCompute';
import type { BurnInputs } from '@/types/financials';

const BASE: BurnInputs = {
  monthly_burn_gbp: 0,
  cash_in_bank_gbp: 0,
  monthly_revenue_gbp: 0,
  notes: '',
};

describe('useBurnCompute', () => {
  it('reports safe when runway > 6 months', () => {
    const { result } = renderHook(() =>
      useBurnCompute({
        ...BASE,
        monthly_burn_gbp: 1_000,
        cash_in_bank_gbp: 100_000,
      }),
    );
    expect(result.current.net_burn_gbp).toBe(1_000);
    expect(result.current.runway_months).toBe(100);
    expect(result.current.status).toBe('safe');
  });

  it('reports warn when runway equals warn threshold', () => {
    const { result } = renderHook(() =>
      useBurnCompute({
        ...BASE,
        monthly_burn_gbp: 5_000,
        cash_in_bank_gbp: 15_000,
      }),
    );
    expect(result.current.runway_months).toBe(3);
    expect(result.current.status).toBe('warn');
  });

  it('reports critical when runway < 3 months', () => {
    const { result } = renderHook(() =>
      useBurnCompute({
        ...BASE,
        monthly_burn_gbp: 10_000,
        cash_in_bank_gbp: 10_000,
      }),
    );
    expect(result.current.runway_months).toBe(1);
    expect(result.current.status).toBe('critical');
  });

  it('subtracts revenue from burn when computing net burn',
    () => {
      const { result } = renderHook(() =>
        useBurnCompute({
          ...BASE,
          monthly_burn_gbp: 5_000,
          cash_in_bank_gbp: 50_000,
          monthly_revenue_gbp: 2_000,
        }),
      );
      expect(result.current.net_burn_gbp).toBe(3_000);
    });

  it('returns Infinity runway when net burn is zero', () => {
    const { result } = renderHook(() =>
      useBurnCompute({
        ...BASE,
        monthly_burn_gbp: 5_000,
        cash_in_bank_gbp: 50_000,
        monthly_revenue_gbp: 5_000,
      }),
    );
    expect(result.current.runway_months).toBe(Infinity);
    expect(result.current.status).toBe('safe');
  });

  it('returns Infinity runway when revenue exceeds burn', () => {
    const { result } = renderHook(() =>
      useBurnCompute({
        ...BASE,
        monthly_burn_gbp: 3_000,
        cash_in_bank_gbp: 50_000,
        monthly_revenue_gbp: 4_000,
      }),
    );
    expect(result.current.net_burn_gbp).toBe(-1_000);
    expect(result.current.runway_months).toBe(Infinity);
    expect(result.current.status).toBe('safe');
  });
});
