/**
 * @file useBowlingChart.ts
 * @brief Provides bowling chart objectives and
 *        mutation callbacks for the selected year.
 */

import { useState } from 'react';
import {
  useListBowlingObjectivesQuery,
  useCreateBowlingObjectiveMutation,
  useDeleteBowlingObjectiveMutation,
  useUpsertBowlingMonthMutation,
} from '@/store/api/bowlingApi';
import type { BowlingObjective } from
  '@/types/hoshinBowling';

/** All bowling chart state for the Hoshin page tab. */
export interface BowlingChartState {
  objectives: BowlingObjective[];
  isLoading: boolean;
  year: number;
  setYear: (y: number) => void;
  createObjective: ReturnType<
    typeof useCreateBowlingObjectiveMutation>[0];
  deleteObjective: ReturnType<
    typeof useDeleteBowlingObjectiveMutation>[0];
  upsertMonth: ReturnType<
    typeof useUpsertBowlingMonthMutation>[0];
}

/**
 * @brief Provides bowling chart data for the
 *        selected year and all mutation callbacks.
 * @returns BowlingChartState for the Hoshin page tab.
 */
export function useBowlingChart(): BowlingChartState {
  const [year, setYear] =
    useState(new Date().getFullYear());

  const { data: objectives = [], isLoading } =
    useListBowlingObjectivesQuery(year);

  const [createObjective] =
    useCreateBowlingObjectiveMutation();
  const [deleteObjective] =
    useDeleteBowlingObjectiveMutation();
  const [upsertMonth] = useUpsertBowlingMonthMutation();

  return {
    objectives, isLoading,
    year, setYear,
    createObjective, deleteObjective, upsertMonth,
  };
}
