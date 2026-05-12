'use client';

/**
 * @file useWeeklyReview.ts
 * @brief Hook for the weekly review feature.
 *        Loads current-week state, exposes submit
 *        action, and fires completeStep on success.
 */

import { useCallback } from 'react';
import {
  useGetThisWeekQuery,
  useSubmitReviewMutation,
} from '@/store/api/weeklyReviewApi';
import {
  useCompleteStepMutation,
} from '@/store/api/gamificationApi';
import type {
  WeeklyReview,
  WeeklyReviewFormData,
} from '@/types/weeklyReview';

/** Step ID used by the gamification system. */
const WEEKLY_REVIEW_STEP = 'weekly_review';

/** Return value of useWeeklyReview. */
export interface UseWeeklyReviewResult {
  /** Current week's review or null if not done. */
  thisWeek: WeeklyReview | null | undefined;
  /** True when the current week's review is saved. */
  isThisWeekDone: boolean;
  /** Submit (upsert) the weekly review. */
  submitReview: (
    data: WeeklyReviewFormData,
  ) => Promise<void>;
  /** True while submission is in flight. */
  isSubmitting: boolean;
}

/**
 * Provides weekly review state and actions.
 * Fires completeStep after a successful submit
 * so the founder streak is maintained.
 *
 * @returns Review state and submit action.
 */
export function useWeeklyReview(): UseWeeklyReviewResult {
  const { data: thisWeek } = useGetThisWeekQuery();
  const [doSubmit, { isLoading: isSubmitting }] =
    useSubmitReviewMutation();
  const [completeStep] = useCompleteStepMutation();

  const isThisWeekDone = Boolean(thisWeek?.id);

  const submitReview = useCallback(
    async (data: WeeklyReviewFormData) => {
      await doSubmit(data).unwrap();
      void completeStep(WEEKLY_REVIEW_STEP);
    },
    [doSubmit, completeStep],
  );

  return {
    thisWeek: thisWeek ?? null,
    isThisWeekDone,
    submitReview,
    isSubmitting,
  };
}
