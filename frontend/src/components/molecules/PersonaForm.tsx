'use client';

/**
 * Form molecule for creating or editing a persona.
 * @module components/molecules/PersonaForm
 */
import React from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { usePersonaForm }
  from '@/hooks/usePersonaForm';
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
  const vm = usePersonaForm(initial, onDone);

  return (
    <Box data-testid="persona-form"
      sx={{ display: 'flex', flexDirection: 'column',
        gap: 2 }}>
      <TextField label={t('personaName')}
        value={vm.name}
        onChange={(e) => vm.setName(e.target.value)}
        inputProps={{ 'aria-label': t('personaName') }}
        data-testid="pf-name" fullWidth />
      <TextField label={t('personaRole')}
        value={vm.role}
        onChange={(e) => vm.setRole(e.target.value)}
        inputProps={{ 'aria-label': t('personaRole') }}
        data-testid="pf-role" fullWidth />
      <TagInput label={t('personaPainPoints')}
        tags={vm.painPoints}
        onChange={vm.setPainPoints}
        placeholder={t('addPainPoint')}
        inputAriaLabel={t('addPainPoint')}
        testId="pf-pain-input" />
      <TagInput label={t('personaGoals')}
        tags={vm.goals} onChange={vm.setGoals}
        placeholder={t('addGoal')}
        inputAriaLabel={t('addGoal')}
        testId="pf-goal-input" />
      <TextField label={t('personaNotes')}
        multiline rows={3} value={vm.notes}
        onChange={(e) => vm.setNotes(e.target.value)}
        inputProps={{
          'aria-label': t('personaNotes') }}
        data-testid="pf-notes" fullWidth />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained"
          onClick={() => void vm.handleSubmit()}
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
