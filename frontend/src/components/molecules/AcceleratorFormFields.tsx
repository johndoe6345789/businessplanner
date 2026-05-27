'use client';

/**
 * Lower-half fields for AcceleratorForm.
 * @module components/molecules/AcceleratorFormFields
 */
import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';
import type {
  AcceleratorFormData,
} from '@/types/accelerators';
import {
  ACCELERATOR_TYPES,
  ACCELERATOR_STATUSES,
} from '@/constants/accelerator-form-options';

/** Props for AcceleratorFormFields. */
interface AcceleratorFormFieldsProps {
  /** Current form values. */
  value: AcceleratorFormData;
  /** Called on any field change. */
  onChange: (v: AcceleratorFormData) => void;
}

type AF = AcceleratorFormData;

/**
 * Type, website, deadline, status, notes fields.
 *
 * @param props - value and onChange handler.
 * @returns AcceleratorFormFields UI.
 */
export const AcceleratorFormFields: React.FC<
  AcceleratorFormFieldsProps
> = ({ value, onChange }) => {
  const t = useTranslations('accelerators');
  const set = (
    f: keyof AF, v: AF[typeof f],
  ) => onChange({ ...value, [f]: v });

  return (
    <>
      <TextField label={t('type')}
        value={value.programme_type}
        select fullWidth
        onChange={(e) =>
          set('programme_type',
            e.target.value as AF['programme_type'])}
        inputProps={{ 'data-testid': 'accel-type' }}>
        {ACCELERATOR_TYPES.map((tp) => (
          <MenuItem key={tp} value={tp}>{tp}</MenuItem>
        ))}
      </TextField>
      <TextField label={t('website')}
        value={value.website} fullWidth
        onChange={(e) =>
          set('website', e.target.value)}
        inputProps={{
          'data-testid': 'accel-website' }} />
      <TextField label={t('deadline')} type="date"
        value={value.deadline ?? ''} fullWidth
        InputLabelProps={{ shrink: true }}
        onChange={(e) =>
          set('deadline', e.target.value || null)}
        inputProps={{
          'data-testid': 'accel-deadline' }} />
      <TextField label={t('status')}
        value={value.status} select fullWidth
        onChange={(e) =>
          set('status',
            e.target.value as AF['status'])}
        inputProps={{
          'data-testid': 'accel-status' }}>
        {ACCELERATOR_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>
      <TextField label={t('notes')}
        value={value.notes} multiline minRows={2}
        fullWidth
        onChange={(e) =>
          set('notes', e.target.value)}
        inputProps={{
          'data-testid': 'accel-notes' }} />
    </>
  );
};

export default AcceleratorFormFields;
