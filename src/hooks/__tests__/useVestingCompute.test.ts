import { renderHook } from '@testing-library/react';
import { useVestingCompute } from '../useVestingCompute';

describe('useVestingCompute', () => {
  const STANDARD = {
    totalShares: 1_000,
    cliffMonths: 12,
    vestingMonths: 48,
  };

  it('calculates cliff shares as a proportion', () => {
    const { result } = renderHook(() =>
      useVestingCompute(STANDARD),
    );
    expect(result.current.cliffShares).toBe(250);
  });

  it('computes monthly vesting after cliff', () => {
    const { result } = renderHook(() =>
      useVestingCompute(STANDARD),
    );
    expect(result.current.monthlyVest).toBe(21);
  });

  it('starts schedule at month 0 with 0 shares vested', () => {
    const { result } = renderHook(() =>
      useVestingCompute(STANDARD),
    );
    const first = result.current.schedule[0];
    expect(first.month).toBe(0);
    expect(first.cumulativeVested).toBe(0);
  });

  it('vests cliff shares at the cliff month', () => {
    const { result } = renderHook(() =>
      useVestingCompute(STANDARD),
    );
    const cliffEntry = result.current.schedule.find(
      (e) => e.month === 12,
    );
    expect(cliffEntry?.cumulativeVested).toBe(250);
  });

  it('reaches full vesting by final month', () => {
    const { result } = renderHook(() =>
      useVestingCompute(STANDARD),
    );
    const last = result.current.schedule.at(-1);
    expect(last?.month).toBe(48);
    expect(last?.cumulativeVested).toBe(1_000);
  });

  it('schedule is sorted ascending by month', () => {
    const { result } = renderHook(() =>
      useVestingCompute(STANDARD),
    );
    const months = result.current.schedule.map(
      (e) => e.month,
    );
    expect(months).toEqual([...months].sort((a, b) => a - b));
  });

  it('handles zero cliff correctly', () => {
    const { result } = renderHook(() =>
      useVestingCompute({
        totalShares: 100,
        cliffMonths: 0,
        vestingMonths: 12,
      }),
    );
    expect(result.current.cliffShares).toBe(0);
    const first = result.current.schedule[0];
    expect(first.cumulativeVested).toBe(0);
  });
});
