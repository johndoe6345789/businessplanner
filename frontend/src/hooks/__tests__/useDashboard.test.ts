const queryMock = jest.fn();

jest.mock('@/store/api', () => ({
  useGetDashboardStatsQuery: () => queryMock(),
}));

import { renderHook } from '@testing-library/react';
import { useDashboard } from '../useDashboard';

describe('useDashboard', () => {
  it('returns null stats and loading true initially', () => {
    queryMock.mockReturnValue({
      data: undefined, isLoading: true, error: null,
    });
    const { result } = renderHook(() => useDashboard());
    expect(result.current.stats).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('returns stats data when loaded', () => {
    const stats = { activeWorkers: 5 };
    queryMock.mockReturnValue({
      data: stats, isLoading: false, error: null,
    });
    const { result } = renderHook(() => useDashboard());
    expect(result.current.stats).toBe(stats);
    expect(result.current.error).toBeNull();
  });

  it('returns error message on failure', () => {
    queryMock.mockReturnValue({
      data: undefined, isLoading: false,
      error: { status: 500 },
    });
    const { result } = renderHook(() => useDashboard());
    expect(result.current.error).toBe(
      'Failed to load stats',
    );
  });
});
