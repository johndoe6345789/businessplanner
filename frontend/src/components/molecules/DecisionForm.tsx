'use client';

/**
 * Form for creating or editing a decision.
 * @module components/molecules/DecisionForm
 */
import React from 'react';
import Box from '@shared/m3/Box';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import type { DecisionFormData } from '@/types/decisions';

/** Props for DecisionForm. */
export interface DecisionFormProps {
  /** Current form values. */
  value: DecisionFormData;
  /** Called on any field change. */
  onChange: (v: DecisionFormData) => void;
}

type Field = keyof DecisionFormData;

/**
 * Input fields for all decision log text fields.
 *
 * @param props - value and onChange handler.
 * @returns DecisionForm UI.
 */
export const DecisionForm: React.FC<
  DecisionFormProps
> = ({ value, onChange }) => {
  const t = useTranslations('decisions');

  const set = (f: Field, v: string) =>
    onChange({ ...value, [f]: v });

  const ml = (f: Field, label: string) => (
    <TextField label={label}
      value={value[f]}
      onChange={(e) => set(f, e.target.value)}
      multiline minRows={2} fullWidth
      inputProps={{ 'data-testid': `dec-${f}` }}
    />
  );

  return (
    <Box component="form"
      data-testid="decision-form"
      aria-label={t('formLabel')}
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
      <TextField label={t('title')}
        value={value.title} required fullWidth
        onChange={(e) =>
          set('title', e.target.value)}
        inputProps={{ 'data-testid': 'dec-title' }}
      />
      {ml('context', t('context'))}
      {ml('options_considered', t('options'))}
      {ml('decision', t('decision'))}
      {ml('rationale', t('rationale'))}
      <TextField label={t('plannerStep')}
        value={value.planner_step_id} fullWidth
        onChange={(e) =>
          set('planner_step_id', e.target.value)}
        inputProps={{
          'data-testid': 'dec-planner-step',
        }}
      />
      {ml('outcome', t('outcome'))}
    </Box>
  );
};

export default DecisionForm;
