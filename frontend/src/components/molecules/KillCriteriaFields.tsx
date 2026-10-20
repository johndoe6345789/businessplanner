'use client';

/**
 * Kill criteria numeric input fields molecule.
 * @module components/molecules/KillCriteriaFields
 */
import React from 'react';
import TextField from '@shared/m3/TextField';
import { useTranslations } from 'next-intl';

/** Props for KillCriteriaFields. */
export interface KillCriteriaFieldsProps {
  /** Minimum runway months. */
  runwayMin: number;
  /** Minimum LTV:CAC ratio. */
  ltvCacMin: number;
  /** Minimum weekly active users. */
  wauMin: number;
  /** Called on any field change. */
  onChange: (
    field: 'runway' | 'ltvCac' | 'wau',
    value: number,
  ) => void;
  /** Called when any field loses focus. */
  onBlur: () => void;
}

/**
 * Three number inputs for kill criteria thresholds.
 * @param props - KillCriteriaFieldsProps.
 * @returns KillCriteriaFields UI.
 */
export const KillCriteriaFields: React.FC<
  KillCriteriaFieldsProps
> = ({ runwayMin, ltvCacMin, wauMin, onChange, onBlur }) => {
  const t = useTranslations('financials');
  return (
    <>
      <TextField label={t('killCriteria.runwayMin')}
        type="number" value={runwayMin}
        onChange={(e) =>
          onChange('runway', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{
          'aria-label': t('killCriteria.runwayMin'),
          min: 0 }}
        data-testid="kc-runway"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={t('killCriteria.ltvCacMin')}
        type="number" value={ltvCacMin}
        onChange={(e) =>
          onChange('ltvCac', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{
          'aria-label': t('killCriteria.ltvCacMin'),
          min: 0 }}
        data-testid="kc-ltv-cac"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={t('killCriteria.wauMin')}
        type="number" value={wauMin}
        onChange={(e) =>
          onChange('wau', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{
          'aria-label': t('killCriteria.wauMin'),
          min: 0 }}
        data-testid="kc-wau"
        fullWidth sx={{ mb: 2 }} />
    </>
  );
};

export default KillCriteriaFields;
