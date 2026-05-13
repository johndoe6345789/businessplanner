'use client';

/**
 * Form for creating or editing a pivot record.
 * @module components/molecules/PivotForm
 */
import React from 'react';
import Box from '@shared/m3/Box';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import type { PivotFormData } from '@/types/pivot';

/** Props for PivotForm. */
export interface PivotFormProps {
  /** Current form values. */
  value: PivotFormData;
  /** Called on any field change. */
  onChange: (v: PivotFormData) => void;
}

type Field = keyof PivotFormData;

/**
 * Input fields for all pivot tracker text fields.
 *
 * @param props - value and onChange handler.
 * @returns PivotForm UI.
 */
export const PivotForm: React.FC<
  PivotFormProps
> = ({ value, onChange }) => {
  const t = useTranslations('pivot');

  const set = (f: Field, v: string) =>
    onChange({ ...value, [f]: v });

  const ml = (f: Field, label: string) => (
    <TextField label={label}
      value={value[f]}
      onChange={(e) => set(f, e.target.value)}
      multiline minRows={2} fullWidth
      inputProps={{ 'data-testid': `piv-${f}` }}
    />
  );

  return (
    <Box component="form"
      data-testid="pivot-form"
      aria-label={t('title')}
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
      {ml('original_idea', t('originalIdea'))}
      {ml('new_direction', t('newDirection'))}
      {ml('trigger_event', t('trigger'))}
      {ml('rationale', t('rationale'))}
      {ml('plan_impact', t('planImpact'))}
      <TextField
        label={t('pivotDate')}
        type="date"
        value={value.pivoted_at}
        onChange={(e) =>
          set('pivoted_at', e.target.value)}
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputProps={{
          'data-testid': 'piv-pivoted_at',
        }}
      />
    </Box>
  );
};

export default PivotForm;
