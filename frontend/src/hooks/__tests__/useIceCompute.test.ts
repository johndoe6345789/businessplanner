import { renderHook } from '@testing-library/react';
import { useIceCompute } from '../useIceCompute';
import type { ScopedFeature } from '@/types/scoping';

const feature = (
  id: string, ice_score: number,
): ScopedFeature => ({
  id, ice_score,
  title: id, description: '',
  impact: 1, confidence: 1, ease: 1,
  status: 'planned',
  created_at: '', updated_at: '',
});

describe('useIceCompute', () => {
  it('returns empty array for no features', () => {
    const { result } = renderHook(() =>
      useIceCompute([]),
    );
    expect(result.current).toHaveLength(0);
  });

  it('returns a single feature unchanged', () => {
    const f = feature('a', 50);
    const { result } = renderHook(() =>
      useIceCompute([f]),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('a');
  });

  it('sorts features by ice_score descending', () => {
    const features = [
      feature('low', 10),
      feature('high', 90),
      feature('mid', 50),
    ];
    const { result } = renderHook(() =>
      useIceCompute(features),
    );
    const ids = result.current.map((f) => f.id);
    expect(ids).toEqual(['high', 'mid', 'low']);
  });

  it('does not mutate the input array', () => {
    const features = [feature('a', 10), feature('b', 90)];
    renderHook(() => useIceCompute(features));
    expect(features[0].id).toBe('a');
  });
});
