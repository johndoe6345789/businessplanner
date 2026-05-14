'use client';

import React from 'react';
import Grid from '@shared/m3/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@shared/m3/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useTranslations } from 'next-intl';
import type { RiskCategory, RiskRating } from '@/types/riskAssessment';
import { useRiskForm } from '@/hooks/useRiskForm';

const CATS: RiskCategory[] =
  ['market','financial','operational','legal','technical'];
const RATINGS: RiskRating[] = [1, 2, 3, 4, 5];

/**
 * Inline form for adding a new risk to the register.
 * State is managed by useRiskForm hook.
 *
 * @returns Form element with risk-entry inputs.
 */
const RiskAddForm: React.FC = () => {
  const t = useTranslations('riskAssessment');
  const f = useRiskForm();

  return (
    <Grid container spacing={2} component="form"
      onSubmit={f.handleSubmit}
      data-testid="risk-add-form"
      aria-label={t('addRisk')}
    >
      <Grid item xs={12} sm={4}>
        <TextField label={t('fields.title')}
          value={f.title} required fullWidth
          onChange={(e) => f.setTitle(e.target.value)}
          size="small"
          data-testid="risk-title-input" />
      </Grid>
      <Grid item xs={6} sm={2}>
        <FormControl fullWidth size="small">
          <InputLabel>{t('fields.category')}</InputLabel>
          <Select value={f.category}
            label={t('fields.category')}
            onChange={(e) =>
              f.setCategory(
                e.target.value as RiskCategory)}>
            {CATS.map((c) => (
              <MenuItem key={c} value={c}>
                {t(`category.${c}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3} sm={1}>
        <FormControl fullWidth size="small">
          <InputLabel>P</InputLabel>
          <Select value={f.probability} label="P"
            onChange={(e) =>
              f.setProbability(
                Number(e.target.value) as RiskRating)}>
            {RATINGS.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3} sm={1}>
        <FormControl fullWidth size="small">
          <InputLabel>I</InputLabel>
          <Select value={f.impact} label="I"
            onChange={(e) =>
              f.setImpact(
                Number(e.target.value) as RiskRating)}>
            {RATINGS.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField label={t('fields.owner')}
          value={f.owner} fullWidth
          onChange={(e) => f.setOwner(e.target.value)}
          size="small" />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button type="submit" variant="contained"
          fullWidth disabled={f.isLoading}
          data-testid="risk-add-submit"
        >{t('addRisk')}</Button>
      </Grid>
    </Grid>
  );
};

export default RiskAddForm;
