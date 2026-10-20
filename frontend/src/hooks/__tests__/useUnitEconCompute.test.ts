import { renderHook } from '@testing-library/react';
import { useUnitEconCompute } from '../useUnitEconCompute';
import type { UnitEconInputs } from '@/types/financials';

const BASE: UnitEconInputs = {
  cac_gbp: 0, arpu_gbp: 0, churn_pct: 0, cogs_pct: 0,
};

describe('useUnitEconCompute', () => {
  it('computes gross margin as 100 minus cogs', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({ ...BASE, cogs_pct: 30 }),
    );
    expect(result.current.gross_margin_pct).toBe(70);
  });

  it('computes LTV from arpu, margin and churn', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({
        ...BASE, arpu_gbp: 100, churn_pct: 10, cogs_pct: 20,
      }),
    );
    expect(result.current.ltv_gbp).toBe(800);
  });

  it('returns Infinity LTV when churn is zero', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({ ...BASE, arpu_gbp: 50, churn_pct: 0 }),
    );
    expect(result.current.ltv_gbp).toBe(Infinity);
  });

  it('computes LTV:CAC ratio', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({
        ...BASE, cac_gbp: 200, arpu_gbp: 100, churn_pct: 10,
      }),
    );
    expect(result.current.ltv_cac_ratio).toBe(5);
  });

  it('returns Infinity ratio when CAC is zero', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({
        ...BASE, cac_gbp: 0, arpu_gbp: 50, churn_pct: 5,
      }),
    );
    expect(result.current.ltv_cac_ratio).toBe(Infinity);
  });

  it('reports good status when ratio >= 3', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({
        ...BASE, cac_gbp: 100, arpu_gbp: 100, churn_pct: 10,
      }),
    );
    expect(result.current.status).toBe('good');
  });

  it('reports warn status when ratio is between 1 and 3', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({
        ...BASE, cac_gbp: 800, arpu_gbp: 100, churn_pct: 10,
      }),
    );
    expect(result.current.status).toBe('warn');
  });

  it('reports poor status when ratio < 1', () => {
    const { result } = renderHook(() =>
      useUnitEconCompute({
        ...BASE, cac_gbp: 2000, arpu_gbp: 50, churn_pct: 50,
      }),
    );
    expect(result.current.status).toBe('poor');
  });
});
