'use client';

/**
 * @brief Local form state for WeeklyReviewForm.
 * @module hooks/useWeeklyReviewFormState
 */
import { useState, useEffect } from 'react';
import type {
  WeeklyReview,
  WeeklyReviewFormData,
} from '@/types/weeklyReview';

type SubmitFn = (
  data: WeeklyReviewFormData,
) => Promise<void>;

/**
 * Manages text fields, morale slider, and saved
 * flag for the weekly review form. Pre-fills from
 * the persisted review when it loads.
 *
 * @param thisWeek - Current week's review, if any.
 * @param submitReview - Action from useWeeklyReview.
 * @returns Form field state and submit handler.
 */
export function useWeeklyReviewFormState(
  thisWeek: WeeklyReview | null | undefined,
  submitReview: SubmitFn,
) {
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextGoals, setNextGoals] = useState('');
  const [morale, setMorale] = useState(3);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!thisWeek) return;
    setWins(thisWeek.wins);
    setChallenges(thisWeek.challenges);
    setNextGoals(thisWeek.next_goals);
    setMorale(thisWeek.morale);
  }, [thisWeek]);

  const handleSubmit = async () => {
    await submitReview({
      week_start: thisWeek?.week_start ?? '',
      wins, challenges,
      next_goals: nextGoals,
      morale: morale as 1 | 2 | 3 | 4 | 5,
    });
    setSaved(true);
  };

  return {
    wins, setWins,
    challenges, setChallenges,
    nextGoals, setNextGoals,
    morale, setMorale,
    saved, handleSubmit,
  };
}
