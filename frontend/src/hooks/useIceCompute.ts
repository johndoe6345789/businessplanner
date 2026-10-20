/**
 * Pure computation hook for ICE score ranking.
 * @module hooks/useIceCompute
 */
import { useMemo } from 'react';
import type { ScopedFeature } from '@/types/scoping';

/**
 * Returns a copy of the features array sorted by
 * ICE score (impact × confidence × ease) descending.
 * @param features - Unsorted feature array.
 * @returns Sorted feature array.
 */
export function useIceCompute(
  features: ScopedFeature[],
): ScopedFeature[] {
  return useMemo(
    () =>
      [...features].sort(
        (a, b) => b.ice_score - a.ice_score,
      ),
    [features],
  );
}
