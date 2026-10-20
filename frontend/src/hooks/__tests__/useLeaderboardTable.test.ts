import { renderHook, act } from '@testing-library/react';

const getLeaderboardMock = jest.fn();
const selectorMock = jest.fn();
const tMock = jest.fn((k: string) => k);

jest.mock('@/store/api/gamificationApi', () => ({
  useGetLeaderboardQuery: (
    args: { period: string; limit: number },
  ) => getLeaderboardMock(args),
}));

jest.mock('@/store/hooks', () => ({
  useAppSelector: (
    fn: (s: { auth: { user?: { id: string } } }) => unknown,
  ) => selectorMock(fn),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => tMock,
}));

import { useLeaderboardTable } from '../useLeaderboardTable';
import type { LeaderboardEntry } from '@/types/gamification';

const ROW: LeaderboardEntry = {
  id: 'u1', username: 'alice', displayName: 'Alice',
  avatarUrl: '', totalPoints: 100, currentLevel: 2,
  currentStreak: 3, badgeCount: 5, rank: 1,
};

describe('useLeaderboardTable', () => {
  beforeEach(() => {
    getLeaderboardMock.mockReturnValue({
      data: [ROW], isLoading: false,
    });
    selectorMock.mockReturnValue('u1');
  });

  it('defaults period to "all"', () => {
    const { result } = renderHook(
      () => useLeaderboardTable());
    expect(result.current.period).toBe('all');
  });

  it('accepts a custom initial period', () => {
    const { result } = renderHook(
      () => useLeaderboardTable('weekly'));
    expect(result.current.period).toBe('weekly');
  });

  it('setPeriod changes period', () => {
    const { result } = renderHook(
      () => useLeaderboardTable());
    act(() => { result.current.setPeriod('monthly'); });
    expect(result.current.period).toBe('monthly');
  });

  it('returns rows from the query', () => {
    const { result } = renderHook(
      () => useLeaderboardTable());
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.rows[0].id).toBe('u1');
  });

  it('rows defaults to [] when data is undefined', () => {
    getLeaderboardMock.mockReturnValue({
      data: undefined, isLoading: true,
    });
    const { result } = renderHook(
      () => useLeaderboardTable());
    expect(result.current.rows).toEqual([]);
  });

  it('queries with limit 50', () => {
    renderHook(() => useLeaderboardTable());
    expect(getLeaderboardMock).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50 }));
  });

  it('exposes userId from the selector', () => {
    const { result } = renderHook(
      () => useLeaderboardTable());
    expect(result.current.userId).toBe('u1');
  });
});
