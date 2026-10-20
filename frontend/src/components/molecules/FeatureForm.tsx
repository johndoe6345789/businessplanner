'use client';

/**
 * Form molecule for creating or editing a feature.
 * @module components/molecules/FeatureForm
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import TextField from '@shared/m3/TextField';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import Slider from '@mui/material/Slider';
import { useTranslations } from 'next-intl';
import type {
  ScopedFeatureFormData, ScopedFeature,
} from '@/types/scoping';

/** Props for FeatureForm. */
export interface FeatureFormProps {
  readonly initial?: ScopedFeature;
  readonly onSubmit: (
    data: ScopedFeatureFormData) => void;
  readonly onCancel: () => void;
}

/**
 * Add or edit feature form with live ICE preview.
 * @param props - FeatureFormProps.
 * @returns Feature form UI.
 */
export const FeatureForm: React.FC<FeatureFormProps> = (
  { initial, onSubmit, onCancel },
) => {
  const t = useTranslations('scoping');
  const tc = useTranslations('common');
  const [title, setTitle] =
    useState(initial?.title ?? '');
  const [description, setDescription] =
    useState(initial?.description ?? '');
  const [impact, setImpact] =
    useState(initial?.impact ?? 5);
  const [confidence, setConfidence] =
    useState(initial?.confidence ?? 5);
  const [ease, setEase] =
    useState(initial?.ease ?? 5);

  return (
    <Box data-testid="feature-form"
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
      <TextField label={t('title')} value={title}
        fullWidth
        onChange={(e) => setTitle(e.target.value)}
        inputProps={{ 'aria-label': t('title') }}
        data-testid="ff-title" />
      <TextField value={description} fullWidth
        multiline rows={2} label="Description"
        onChange={(e) => setDescription(e.target.value)}
        inputProps={{ 'aria-label': 'Description' }}
        data-testid="ff-description" />
      {([
        ['impact', impact, setImpact, 'ff-impact'],
        ['confidence', confidence, setConfidence,
          'ff-confidence'],
        ['ease', ease, setEase, 'ff-ease'],
      ] as const).map(([key, val, set, tid]) => (
        <Box key={key}>
          <Typography variant="body2">
            {t(key)} — {val}
          </Typography>
          <Slider value={val} min={1} max={10} step={1}
            onChange={(_, v) => set(v as number)}
            aria-label={t(key)}
            data-testid={tid} />
        </Box>
      ))}
      <Typography variant="subtitle2"
        data-testid="ff-ice-preview">
        {t('iceScore')}: {impact * confidence * ease}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained"
          aria-label={tc('save')}
          data-testid="ff-submit"
          onClick={() => onSubmit({
            title, description, impact, confidence,
            ease, status: initial?.status ?? 'considering',
          })}>
          {tc('save')}
        </Button>
        <Button onClick={onCancel}
          aria-label={tc('cancel')}
          data-testid="ff-cancel">
          {tc('cancel')}
        </Button>
      </Box>
    </Box>
  );
};
export default FeatureForm;
