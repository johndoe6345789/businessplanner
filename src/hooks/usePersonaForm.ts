'use client';

/**
 * @brief Form state and submit handler for PersonaForm.
 * @module hooks/usePersonaForm
 */
import { useState } from 'react';
import {
  useCreatePersonaMutation,
  useUpdatePersonaMutation,
} from '@/store/api/marketResearchPersonaApi';
import type { Persona } from '@/types/marketResearch';

/**
 * Manages add/edit persona form fields and
 * dispatches create or update mutations on submit.
 *
 * @param initial - Pre-filled persona in edit mode.
 * @param onDone - Called after a successful save.
 * @returns Form field state and submit handler.
 */
export function usePersonaForm(
  initial: Persona | undefined,
  onDone: () => void,
) {
  const [create] = useCreatePersonaMutation();
  const [update] = useUpdatePersonaMutation();
  const [name, setName] =
    useState(initial?.name ?? '');
  const [role, setRole] =
    useState(initial?.role ?? '');
  const [painPoints, setPainPoints] =
    useState<string[]>(initial?.painPoints ?? []);
  const [goals, setGoals] =
    useState<string[]>(initial?.goals ?? []);
  const [notes, setNotes] =
    useState(initial?.notes ?? '');

  const handleSubmit = async () => {
    const payload = {
      name, role, painPoints, goals, notes,
    };
    if (initial) {
      await update({ id: initial.id, data: payload });
    } else {
      await create(payload);
    }
    onDone();
  };

  return {
    name, setName, role, setRole,
    painPoints, setPainPoints,
    goals, setGoals, notes, setNotes,
    handleSubmit,
  };
}
