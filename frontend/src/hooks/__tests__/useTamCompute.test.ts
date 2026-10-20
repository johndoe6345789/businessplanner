import { renderHook } from '@testing-library/react';
import { useTamCompute } from '../useTamCompute';
import type { TamComputeInputs } from '../useTamCompute';

const BASE: TamComputeInputs = {
  totalMarketUsd: 0,
  targetSegmentPct: 0,
  reachablePct: 0,
};

describe('useTamCompute', () => {
  it('TAM equals totalMarketUsd', () => {
    const { result } = renderHook(() =>
      useTamCompute({ ...BASE, totalMarketUsd: 1_000_000 }),
    );
    expect(result.current.tam).toBe(1_000_000);
  });

  it('SAM is the target segment fraction of TAM', () => {
    const { result } = renderHook(() =>
      useTamCompute({
        totalMarketUsd: 1_000_000,
        targetSegmentPct: 10,
        reachablePct: 0,
      }),
    );
    expect(result.current.sam).toBe(100_000);
  });

  it('SOM is the reachable fraction of SAM', () => {
    const { result } = renderHook(() =>
      useTamCompute({
        totalMarketUsd: 1_000_000,
        targetSegmentPct: 10,
        reachablePct: 5,
      }),
    );
    // SAM = 100k, SOM = 100k * 0.05 = 5000
    expect(result.current.som).toBe(5_000);
  });

  it('returns zeros for zero market', () => {
    const { result } = renderHook(() =>
      useTamCompute(BASE),
    );
    expect(result.current.tam).toBe(0);
    expect(result.current.sam).toBe(0);
    expect(result.current.som).toBe(0);
  });

  it('handles 100% segment and 100% reachable', () => {
    const { result } = renderHook(() =>
      useTamCompute({
        totalMarketUsd: 500_000,
        targetSegmentPct: 100,
        reachablePct: 100,
      }),
    );
    expect(result.current.tam).toBe(500_000);
    expect(result.current.sam).toBe(500_000);
    expect(result.current.som).toBe(500_000);
  });
});
