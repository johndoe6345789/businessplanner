'use client';

/**
 * @brief ViewModel for the TamCalculator organism.
 * @module hooks/useTamCalculator
 */
import { useState, useEffect } from 'react';
import {
  useGetTamQuery,
  useSaveTamMutation,
} from '@/store/api/marketResearchTamApi';
import { useTamCompute }
  from '@/hooks/useTamCompute';

/**
 * Manages TAM/SAM/SOM calculator state, derives
 * computed results, and exposes a save action.
 *
 * @returns Calculator state and handlers.
 */
export function useTamCalculator() {
  const { data, isLoading } = useGetTamQuery();
  const [saveTam, { isLoading: isSaving }] =
    useSaveTamMutation();
  const [totalMarketUsd, setTotalMarketUsd] =
    useState(0);
  const [targetSegmentPct, setTargetSegmentPct] =
    useState(10);
  const [reachablePct, setReachablePct] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!data) return;
    setTotalMarketUsd(data.totalMarketUsd);
    setTargetSegmentPct(data.targetSegmentPct);
    setReachablePct(data.reachablePct);
    setNotes(data.notes ?? '');
  }, [data]);

  const result = useTamCompute({
    totalMarketUsd, targetSegmentPct, reachablePct,
  });

  const handleSave = () =>
    void saveTam({
      totalMarketUsd, targetSegmentPct,
      reachablePct, notes,
    });

  return {
    isLoading, isSaving, result,
    totalMarketUsd, setTotalMarketUsd,
    targetSegmentPct, setTargetSegmentPct,
    reachablePct, setReachablePct,
    notes, setNotes, handleSave,
  };
}
