'use client';

/**
 * Form for creating or editing an accelerator record.
 * @module components/molecules/AcceleratorForm
 */
import React from 'react';
import Box from '@shared/m3/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslations } from 'next-intl';
import type {
  AcceleratorFormData,
  KnownAccelerator,
} from '@/types/accelerators';
import known
  from '@/constants/known-accelerators.json';
import { AcceleratorFormFields }
  from './AcceleratorFormFields';
import { OrgSearchSelect }
  from './OrgSearchSelect';

/** Props for AcceleratorForm. */
export interface AcceleratorFormProps {
  /** Current form values. */
  value: AcceleratorFormData;
  /** Called on any field change. */
  onChange: (v: AcceleratorFormData) => void;
}

/**
 * Input fields for all accelerator programme fields.
 *
 * @param props - value and onChange handler.
 * @returns AcceleratorForm UI.
 */
export const AcceleratorForm: React.FC<
  AcceleratorFormProps
> = ({ value, onChange }) => {
  const t = useTranslations('accelerators');
  const set = (
    f: keyof AcceleratorFormData,
    v: AcceleratorFormData[typeof f],
  ) => onChange({ ...value, [f]: v });

  return (
    <Box component="form"
      data-testid="accel-form"
      aria-label={t('title')}
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
      <Autocomplete
        options={known as KnownAccelerator[]}
        getOptionLabel={(o) => o.name}
        onChange={(_, v) => v && onChange({
          ...value, name: v.name,
          website: v.website,
          programme_type: v.type,
        })}
        renderInput={(p) => (
          <TextField {...p}
            label={t('prefill')}
            data-testid="accel-prefill" />
        )}
      />
      <TextField label={t('name')}
        value={value.name} required fullWidth
        onChange={(e) =>
          set('name', e.target.value)}
        inputProps={{
          'data-testid': 'accel-name',
        }} />
      <OrgSearchSelect
        value={value.organisation_id ?? null}
        onChange={(id) =>
          set('organisation_id', id)} />
      <AcceleratorFormFields value={value}
        onChange={onChange} />
    </Box>
  );
};

export default AcceleratorForm;
