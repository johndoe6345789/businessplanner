/**
 * @file useOkr.ts
 * @brief Provides OKR objectives with key results
 *        for the selected quarter/year period.
 */

import { useState } from 'react';
import {
  useListOkrObjectivesQuery,
  useCreateOkrObjectiveMutation,
  useDeleteOkrObjectiveMutation,
  useAddKeyResultMutation,
  useUpdateKeyResultMutation,
  useDeleteKeyResultMutation,
} from '@/store/api/okrApi';
import type { OkrObjective } from '@/types/okr';

/** All OKR state consumed by the OKR page. */
export interface OkrState {
  objectives: OkrObjective[];
  isLoading: boolean;
  quarter: number;
  year: number;
  setQuarter: (q: number) => void;
  setYear: (y: number) => void;
  createObjective: ReturnType<
    typeof useCreateOkrObjectiveMutation>[0];
  deleteObjective: ReturnType<
    typeof useDeleteOkrObjectiveMutation>[0];
  addKeyResult: ReturnType<
    typeof useAddKeyResultMutation>[0];
  updateKeyResult: ReturnType<
    typeof useUpdateKeyResultMutation>[0];
  deleteKeyResult: ReturnType<
    typeof useDeleteKeyResultMutation>[0];
}

const now = new Date();
const currentQuarter = Math.ceil(
  (now.getMonth() + 1) / 3);

/**
 * @brief Provides OKR data for the selected period
 *        and all mutation callbacks.
 * @returns OkrState for the OKR board page.
 */
export function useOkr(): OkrState {
  const [quarter, setQuarter] =
    useState(currentQuarter);
  const [year, setYear] =
    useState(now.getFullYear());

  const { data: objectives = [], isLoading } =
    useListOkrObjectivesQuery({ quarter, year });

  const [createObjective] =
    useCreateOkrObjectiveMutation();
  const [deleteObjective] =
    useDeleteOkrObjectiveMutation();
  const [addKeyResult] = useAddKeyResultMutation();
  const [updateKeyResult] = useUpdateKeyResultMutation();
  const [deleteKeyResult] = useDeleteKeyResultMutation();

  return {
    objectives, isLoading,
    quarter, year, setQuarter, setYear,
    createObjective, deleteObjective,
    addKeyResult, updateKeyResult, deleteKeyResult,
  };
}
