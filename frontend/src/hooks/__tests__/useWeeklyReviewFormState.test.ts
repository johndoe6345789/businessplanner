import { renderHook, act } from '@testing-library/react';
import { useWeeklyReviewFormState }
  from '../useWeeklyReviewFormState';
import type { WeeklyReview } from '@/types/weeklyReview';

const REVIEW: WeeklyReview = {
  id: 'r-1',
  week_start: '2025-05-19',
  wins: 'Launched feature',
  challenges: 'Infra issues',
  next_goals: 'Fix deploy',
  morale: 4,
  created_at: '2025-05-19T00:00:00Z',
};

describe('useWeeklyReviewFormState', () => {
  it('initialises with empty fields and morale 3', () => {
    const submit = jest.fn();
    const { result } = renderHook(() =>
      useWeeklyReviewFormState(null, submit));
    expect(result.current.wins).toBe('');
    expect(result.current.challenges).toBe('');
    expect(result.current.nextGoals).toBe('');
    expect(result.current.morale).toBe(3);
    expect(result.current.saved).toBe(false);
  });

  it('pre-fills from thisWeek when provided', () => {
    const submit = jest.fn();
    const { result } = renderHook(() =>
      useWeeklyReviewFormState(REVIEW, submit));
    expect(result.current.wins).toBe('Launched feature');
    expect(result.current.challenges).toBe('Infra issues');
    expect(result.current.nextGoals).toBe('Fix deploy');
    expect(result.current.morale).toBe(4);
  });

  it('updates fields via setters', () => {
    const submit = jest.fn();
    const { result } = renderHook(() =>
      useWeeklyReviewFormState(null, submit));
    act(() => {
      result.current.setWins('Big win');
      result.current.setChallenges('Tight deadline');
      result.current.setNextGoals('Ship v2');
      result.current.setMorale(5);
    });
    expect(result.current.wins).toBe('Big win');
    expect(result.current.challenges).toBe('Tight deadline');
    expect(result.current.nextGoals).toBe('Ship v2');
    expect(result.current.morale).toBe(5);
  });

  it('handleSubmit calls submitReview with form data', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useWeeklyReviewFormState(REVIEW, submit));
    act(() => { result.current.setWins('New win'); });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        week_start: '2025-05-19',
        wins: 'New win',
        challenges: 'Infra issues',
        next_goals: 'Fix deploy',
        morale: 4,
      }),
    );
  });

  it('handleSubmit sets saved to true on success', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useWeeklyReviewFormState(null, submit));
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.saved).toBe(true);
  });

  it('pre-fills fields when thisWeek changes', () => {
    const submit = jest.fn();
    const { result, rerender } = renderHook(
      ({ review }: { review: WeeklyReview | null }) =>
        useWeeklyReviewFormState(review, submit),
      { initialProps: { review: null } },
    );
    expect(result.current.wins).toBe('');
    rerender({ review: REVIEW });
    expect(result.current.wins).toBe('Launched feature');
  });
});
