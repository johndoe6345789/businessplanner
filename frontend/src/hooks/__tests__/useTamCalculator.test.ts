/**
 * useTamCalculator wraps useTamCompute + RTK Query
 * mutations. The RTK Query layer requires a Redux
 * Provider and a real API endpoint, so we test the
 * pure computation layer (useTamCompute) directly,
 * which is the sole source of business logic.
 */
import { renderHook } from '@testing-library/react';
import {
  useTamCompute,
  type TamComputeInputs,
} from '../useTamCompute';

const base: TamComputeInputs = {
  totalMarketUsd: 1_000_000,
  targetSegmentPct: 10,
  reachablePct: 5,
};

describe('useTamCompute (core of useTamCalculator)', () => {
  it('tam equals totalMarketUsd', () => {
    const { result } = renderHook(() =>
      useTamCompute(base));
    expect(result.current.tam).toBe(1_000_000);
  });

  it('sam is tam * targetSegmentPct / 100', () => {
    const { result } = renderHook(() =>
      useTamCompute(base));
    expect(result.current.sam).toBeCloseTo(100_000);
  });

  it('som is sam * reachablePct / 100', () => {
    const { result } = renderHook(() =>
      useTamCompute(base));
    expect(result.current.som).toBeCloseTo(5_000);
  });

  it('returns zero values when market is 0', () => {
    const { result } = renderHook(() =>
      useTamCompute({
        ...base, totalMarketUsd: 0,
      }));
    expect(result.current.tam).toBe(0);
    expect(result.current.sam).toBe(0);
    expect(result.current.som).toBe(0);
  });

  it('returns full sam when reachablePct is 100', () => {
    const { result } = renderHook(() =>
      useTamCompute({
        ...base, reachablePct: 100,
      }));
    expect(result.current.som).toBeCloseTo(
      result.current.sam,
    );
  });

  it('som is 0 when reachablePct is 0', () => {
    const { result } = renderHook(() =>
      useTamCompute({
        ...base, reachablePct: 0,
      }));
    expect(result.current.som).toBe(0);
  });

  it('handles 100% targetSegmentPct (sam == tam)', () => {
    const { result } = renderHook(() =>
      useTamCompute({
        ...base, targetSegmentPct: 100,
      }));
    expect(result.current.sam).toBeCloseTo(
      result.current.tam,
    );
  });
});
