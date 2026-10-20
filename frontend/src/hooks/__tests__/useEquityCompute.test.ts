import { renderHook } from '@testing-library/react';
import { useEquityCompute } from '../useEquityCompute';
import type { FounderInput } from '@/types/legal';

const CEO: FounderInput = {
  name: 'Alice',
  role: 'ceo',
  timeCommitmentMonths: 0,
  capitalContribution: 0,
  ideaOriginator: false,
  priorExperience: 'medium',
};

describe('useEquityCompute', () => {
  it('returns empty splits for no founders', () => {
    const { result } = renderHook(() =>
      useEquityCompute([]),
    );
    expect(result.current.splits).toHaveLength(0);
    expect(result.current.totalScore).toBe(0);
  });

  it('awards 100% equity to a sole founder', () => {
    const { result } = renderHook(() =>
      useEquityCompute([CEO]),
    );
    expect(result.current.splits[0].equityPct).toBe(100);
  });

  it('awards idea originator bonus of 10 points', () => {
    const withIdea: FounderInput = {
      ...CEO, ideaOriginator: true,
    };
    const { result: r1 } = renderHook(() =>
      useEquityCompute([CEO]),
    );
    const { result: r2 } = renderHook(() =>
      useEquityCompute([withIdea]),
    );
    expect(r2.current.totalScore - r1.current.totalScore)
      .toBe(10);
  });

  it('splits equity equally between identical founders', () => {
    const { result } = renderHook(() =>
      useEquityCompute([CEO, CEO]),
    );
    expect(result.current.splits[0].equityPct).toBe(50);
    expect(result.current.splits[1].equityPct).toBe(50);
  });

  it('caps time contribution at MAX_TIME points (50)', () => {
    const longTenure: FounderInput = {
      ...CEO, timeCommitmentMonths: 40,
    };
    const { result } = renderHook(() =>
      useEquityCompute([longTenure]),
    );
    const expectedScore =
      40 + 50 + 0 + 0 + 10;
    expect(result.current.totalScore).toBe(expectedScore);
  });

  it('caps capital contribution at MAX_CAPITAL points (20)',
    () => {
      const heavyCapital: FounderInput = {
        ...CEO, capitalContribution: 25_000,
      };
      const { result } = renderHook(() =>
        useEquityCompute([heavyCapital]),
      );
      const expectedScore =
        40 + 0 + 20 + 0 + 10;
      expect(result.current.totalScore).toBe(expectedScore);
    });

  it('falls back to "Founder N" when name is empty', () => {
    const unnamed: FounderInput = { ...CEO, name: '' };
    const { result } = renderHook(() =>
      useEquityCompute([unnamed]),
    );
    expect(result.current.splits[0].name).toBe('Founder 1');
  });
});
