'use client';

import React from 'react';
import {
  Box, TextField, Select, MenuItem,
  FormControl, InputLabel, Button,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { KpiCategory, CreateKpiInput } from '@/types/kpi';
import { useKpiAddForm } from '@/hooks/useKpiAddForm';

const CATS: KpiCategory[] = [
  'financial', 'customer', 'operational', 'growth',
];

/** Props for KpiAddForm. */
export interface KpiAddFormProps {
  /** Called with validated payload on submit. */
  readonly onSubmit: (input: CreateKpiInput) => void;
  /** Disables submit while request is in-flight. */
  readonly isLoading?: boolean;
}

/** Compact inline form for creating a KPI metric. */
const KpiAddForm: React.FC<KpiAddFormProps> = (
  { onSubmit, isLoading },
) => {
  const t = useTranslations('kpi');
  const f = useKpiAddForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = f.buildInput();
    if (!input) return;
    onSubmit(input);
    f.reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
      data-testid="kpi-add-form"
      aria-label={t('addMetric')}>
      <TextField label="Title" size="small"
        value={f.title} required
        onChange={(e) => f.setTitle(e.target.value)}
        data-testid="kpi-title-input" />
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Category</InputLabel>
        <Select value={f.category} label="Category"
          onChange={(e) =>
            f.setCategory(e.target.value as KpiCategory)}>
          {CATS.map((c) => (
            <MenuItem key={c} value={c}>
              {t(`category.${c}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label={t('targetValue')} size="small"
        type="number" value={f.target} required
        onChange={(e) => f.setTarget(e.target.value)}
        data-testid="kpi-target-input"
        sx={{ width: 100 }} />
      <TextField label={t('unit')} size="small"
        value={f.unit}
        onChange={(e) => f.setUnit(e.target.value)}
        data-testid="kpi-unit-input" sx={{ width: 80 }} />
      <Button type="submit" variant="contained"
        disabled={isLoading} data-testid="kpi-add-submit">
        {t('addMetric')}
      </Button>
    </Box>
  );
};

export default KpiAddForm;
