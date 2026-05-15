'use client';

/**
 * State and mutation logic for CompetitorForm.
 * @module components/molecules/useCompetitorForm
 */
import { useState } from 'react';
import {
  useCreateCompetitorMutation,
  useUpdateCompetitorMutation,
} from '@/store/api/marketResearchCompetitorApi';
import type { Competitor }
  from '@/types/marketResearch';

export const COMPETITOR_STAGES = [
  'idea', 'early', 'growth', 'enterprise',
] as const;

/**
 * Manages field state and save logic for a competitor
 * add/edit form.
 *
 * @param initial - Existing record in edit mode.
 * @param onDone - Called after a successful save.
 * @returns Field values, setters, and handleSubmit.
 */
export function useCompetitorForm(
  initial?: Competitor,
  onDone?: () => void,
) {
  const [create] = useCreateCompetitorMutation();
  const [update] = useUpdateCompetitorMutation();

  const [name, setName] =
    useState(initial?.name ?? '');
  const [website, setWebsite] =
    useState(initial?.website ?? '');
  const [stage, setStage] =
    useState(initial?.stage ?? COMPETITOR_STAGES[0]);
  const [strengths, setStrengths] =
    useState<string[]>(initial?.strengths ?? []);
  const [weaknesses, setWeaknesses] =
    useState<string[]>(initial?.weaknesses ?? []);
  const [notes, setNotes] =
    useState(initial?.notes ?? '');
  const [orgId, setOrgId] =
    useState<string | null>(
      initial?.organisation_id ?? null,
    );

  const handleSubmit = async () => {
    const payload = {
      name, website, stage, strengths, weaknesses,
      notes,
      features: {} as Record<string, boolean>,
      organisation_id: orgId,
    };
    if (initial) {
      await update({ id: initial.id, data: payload });
    } else {
      await create(payload);
    }
    onDone?.();
  };

  return {
    name, setName,
    website, setWebsite,
    stage, setStage,
    strengths, setStrengths,
    weaknesses, setWeaknesses,
    notes, setNotes,
    orgId, setOrgId,
    handleSubmit,
  };
}
