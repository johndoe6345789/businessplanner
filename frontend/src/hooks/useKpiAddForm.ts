/**
 * @file useKpiAddForm.ts
 * @brief Local form state for KpiAddForm.
 */

import { useState } from 'react';
import type {
  CreateKpiInput, KpiCategory,
} from '@/types/kpi';

/** Return shape of useKpiAddForm. */
export interface KpiAddFormState {
  title: string;
  setTitle: (v: string) => void;
  category: KpiCategory;
  setCategory: (v: KpiCategory) => void;
  target: string;
  setTarget: (v: string) => void;
  unit: string;
  setUnit: (v: string) => void;
  buildInput: () => CreateKpiInput | null;
  reset: () => void;
}

/**
 * @brief Manages controlled state for the KPI add
 *        form and builds the submit payload.
 * @returns KpiAddFormState.
 */
export function useKpiAddForm(): KpiAddFormState {
  const [title, setTitle] = useState('');
  const [category, setCategory] =
    useState<KpiCategory>('financial');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  const reset = () => {
    setTitle(''); setTarget(''); setUnit('');
  };

  const buildInput = (): CreateKpiInput | null => {
    if (!title || !target) return null;
    return {
      title, category,
      current_value: 0,
      target_value: parseFloat(target),
      baseline_value: 0,
      unit,
      period_start: new Date()
        .toISOString().slice(0, 10),
      period_end: new Date(Date.now() + 86400000 * 90)
        .toISOString().slice(0, 10),
    };
  };

  return {
    title, setTitle, category, setCategory,
    target, setTarget, unit, setUnit,
    buildInput, reset,
  };
}
