/**
 * @file usePdca.ts
 * @brief Provides PDCA cycle list, mutation
 *        callbacks, and active-cycle selection state.
 */

import { useState } from 'react';
import {
  useListPdcaCyclesQuery,
  useCreatePdcaCycleMutation,
  useUpdatePdcaPhaseMutation,
  useDeletePdcaCycleMutation,
} from '@/store/api/pdcaApi';
import type { PdcaCycle } from '@/types/pdca';

/** All PDCA state consumed by the PDCA page. */
export interface PdcaState {
  cycles: PdcaCycle[];
  isLoading: boolean;
  activeCycleId: string | null;
  setActiveCycleId: (id: string | null) => void;
  activeCycle: PdcaCycle | undefined;
  createCycle: ReturnType<
    typeof useCreatePdcaCycleMutation>[0];
  updatePhase: ReturnType<
    typeof useUpdatePdcaPhaseMutation>[0];
  deleteCycle: ReturnType<
    typeof useDeletePdcaCycleMutation>[0];
}

/**
 * @brief Provides PDCA cycle data and mutations,
 *        with local active-cycle selection.
 * @returns PdcaState for the PDCA board page.
 */
export function usePdca(): PdcaState {
  const { data: cycles = [], isLoading } =
    useListPdcaCyclesQuery();
  const [createCycle] = useCreatePdcaCycleMutation();
  const [updatePhase] = useUpdatePdcaPhaseMutation();
  const [deleteCycle] = useDeletePdcaCycleMutation();

  const [activeCycleId, setActiveCycleId] =
    useState<string | null>(null);

  const activeCycle = cycles.find(
    (c) => c.id === activeCycleId);

  return {
    cycles, isLoading,
    activeCycleId, setActiveCycleId, activeCycle,
    createCycle, updatePhase, deleteCycle,
  };
}
