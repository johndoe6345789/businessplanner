/**
 * Pure computation hook for TAM / SAM / SOM values.
 * No API calls are made; results derive directly from inputs.
 * @module hooks/useTamCompute
 */
import { useMemo } from 'react';
import type { TamResult } from '@/types/marketResearch';

/** Inputs accepted by useTamCompute. */
export interface TamComputeInputs {
  /** Total addressable market in USD. */
  totalMarketUsd: number;
  /** Target segment as a percentage of TAM (0–100). */
  targetSegmentPct: number;
  /** Reachable share as a percentage of SAM (0–100). */
  reachablePct: number;
}

/**
 * Computes TAM / SAM / SOM from raw inputs.
 *
 * @param inputs - Market sizing inputs.
 * @returns Computed TamResult with tam, sam, and som.
 *
 * @example
 * const { tam, sam, som } = useTamCompute({
 *   totalMarketUsd: 1_000_000_000,
 *   targetSegmentPct: 10,
 *   reachablePct: 5,
 * });
 */
export function useTamCompute(
  inputs: TamComputeInputs,
): TamResult {
  return useMemo(() => {
    const { totalMarketUsd, targetSegmentPct, reachablePct } =
      inputs;
    const tam = totalMarketUsd;
    const sam = tam * (targetSegmentPct / 100);
    const som = sam * (reachablePct / 100);
    return { tam, sam, som };
  }, [inputs]);
}
