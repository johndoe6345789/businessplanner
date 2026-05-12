'use client';

/**
 * Form molecule for creating or editing a persona.
 * @module components/molecules/PersonaForm
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import {
  useCreatePersonaMutation,
  useUpdatePersonaMutation,
} from '@/store/api/marketResearchPersonaApi';
import { TagInput }
  from '@/components/molecules/TagInput';
import type { Persona } from '@/types/marketResearch';

/** Props for PersonaForm. */
export interface PersonaFormProps {
  /** Pre-populated persona for edit mode. */
  readonly initial?: Persona;
  /** Called after a successful save. */
  readonly onDone: () => void;
}

/**
 * Add / edit persona form.
 *
 * @param props - PersonaFormProps.
 * @returns Persona form UI.
 */
export const PersonaForm: React.FC<
  PersonaFormProps
> = ({ initial, onDone }) => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const [create] = useCreatePersonaMutation();
  const [update] = useUpdatePersonaMutation();

  const [name, setName] = useState(
    initial?.name ?? '');
  const [role, setRole] = useState(
    initial?.role ?? '');
  const [painPoints, setPainPoints] = useState<string[]>(
    initial?.painPoints ?? []);
  const [goals, setGoals] = useState<string[]>(
    initial?.goals ?? []);
  const [notes, setNotes] = useState(
    initial?.notes ?? '');

  const handleSubmit = async () => {
    const payload = { name, role, painPoints,
      goals, notes };
    if (initial) {
      await update({ id: initial.id, data: payload });
    } else {
      await create(payload);
    }
    onDone();
  };

  return (
    <Box data-testid="persona-form"
      sx={{ display: 'flex', flexDirection: 'column',
        gap: 2 }}>
      <TextField label={t('personaName')} value={name}
        onChange={(e) => setName(e.target.value)}
        inputProps={{ 'aria-label': t('personaName') }}
        data-testid="pf-name" fullWidth />
      <TextField label={t('personaRole')} value={role}
        onChange={(e) => setRole(e.target.value)}
        inputProps={{ 'aria-label': t('personaRole') }}
        data-testid="pf-role" fullWidth />
      <TagInput label={t('personaPainPoints')}
        tags={painPoints} onChange={setPainPoints}
        placeholder={t('addPainPoint')}
        inputAriaLabel={t('addPainPoint')}
        testId="pf-pain-input" />
      <TagInput label={t('personaGoals')}
        tags={goals} onChange={setGoals}
        placeholder={t('addGoal')}
        inputAriaLabel={t('addGoal')}
        testId="pf-goal-input" />
      <TextField label={t('personaNotes')}
        multiline rows={3} value={notes}
        onChange={(e) => setNotes(e.target.value)}
        inputProps={{ 'aria-label': t('personaNotes') }}
        data-testid="pf-notes" fullWidth />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained"
          onClick={() => void handleSubmit()}
          aria-label={tc('save')}
          data-testid="pf-submit">
          {tc('save')}
        </Button>
        <Button onClick={onDone}
          aria-label={tc('cancel')}
          data-testid="pf-cancel">
          {tc('cancel')}
        </Button>
      </Box>
    </Box>
  );
};

export default PersonaForm;
