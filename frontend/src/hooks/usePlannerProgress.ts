'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector }
  from '@/store/hooks';
import { toggleStep, resetPlan }
  from '@/store/slices/plannerSlice';
import roadmap
  from '@/constants/startup-roadmap.json';

/** Completion status of a roadmap phase. */
export type PhaseStatus =
  | 'todo'
  | 'in-progress'
  | 'complete';

/** Per-phase progress summary. */
export interface PhaseProgress {
  id: string;
  done: number;
  total: number;
  /** Percentage 0–100. */
  pct: number;
  status: PhaseStatus;
}

/**
 * Determine the display status of a phase.
 *
 * TODO — Your decision: what thresholds feel right?
 *
 * Options to consider:
 *  - 'complete' only at 100%? Or at 75%+?
 *  - Add a 4th 'nearly-done' status for 75–99%?
 *  - Should 'in-progress' start at step 1 or
 *    only after completing the first third?
 *
 * The default below is the simplest correct logic.
 * Edit it to match how you want founders to feel
 * about their progress.
 *
 * @param done - Completed step count.
 * @param total - Total steps in the phase.
 * @returns Phase display status.
 */
export function getPhaseStatus(
  done: number,
  total: number,
): PhaseStatus {
  if (done === 0) return 'todo';
  if (done >= total) return 'complete';
  return 'in-progress';
}

/**
 * Hook providing planner progress state and actions.
 *
 * @returns Completed steps, per-phase progress,
 *   overall percentage, toggle, and reset actions.
 */
export function usePlannerProgress() {
  const dispatch = useAppDispatch();
  const completedSteps = useAppSelector(
    (s) => s.planner.completedSteps,
  );

  const toggle = useCallback(
    (stepId: string) => dispatch(toggleStep(stepId)),
    [dispatch],
  );

  const reset = useCallback(
    () => dispatch(resetPlan()),
    [dispatch],
  );

  const phases: PhaseProgress[] = roadmap.phases.map(
    (phase) => {
      const done = phase.steps.filter(
        (s) => completedSteps[s.id],
      ).length;
      const total = phase.steps.length;
      return {
        id: phase.id,
        done,
        total,
        pct: total > 0
          ? Math.round((done / total) * 100)
          : 0,
        status: getPhaseStatus(done, total),
      };
    },
  );

  const totalDone = phases.reduce(
    (s, p) => s + p.done, 0,
  );
  const totalSteps = phases.reduce(
    (s, p) => s + p.total, 0,
  );

  return {
    completedSteps,
    phases,
    toggle,
    reset,
    overallPct: totalSteps > 0
      ? Math.round((totalDone / totalSteps) * 100)
      : 0,
    totalDone,
    totalSteps,
  };
}
