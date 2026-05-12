'use client';

/**
 * Unit economics number input fields molecule.
 * @module components/molecules/UnitEconInputFields
 */
import React from 'react';
import TextField from '@shared/m3/TextField';
import { useTranslations } from 'next-intl';

/** Props for UnitEconInputFields. */
export interface UnitEconInputFieldsProps {
  /** Customer acquisition cost in GBP. */
  cac: number;
  /** Average revenue per user in GBP. */
  arpu: number;
  /** Monthly churn as a percentage. */
  churn: number;
  /** COGS as a percentage. */
  cogs: number;
  /** Called on field value change. */
  onChange: (
    field: 'cac' | 'arpu' | 'churn' | 'cogs',
    value: number,
  ) => void;
  /** Called when any field loses focus. */
  onBlur: () => void;
}

/**
 * Four number inputs for unit economics calculation.
 * @param props - UnitEconInputFieldsProps.
 * @returns UnitEconInputFields UI.
 */
export const UnitEconInputFields: React.FC<
  UnitEconInputFieldsProps
> = ({ cac, arpu, churn, cogs, onChange, onBlur }) => {
  const t = useTranslations('financials');
  return (
    <>
      <TextField label={`${t('unitEcon.cac')} (£)`}
        type="number" value={cac}
        onChange={(e) =>
          onChange('cac', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{ 'aria-label': t('unitEcon.cac'),
          min: 0 }}
        data-testid="ue-input-cac"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={`${t('unitEcon.arpu')} (£)`}
        type="number" value={arpu}
        onChange={(e) =>
          onChange('arpu', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{ 'aria-label': t('unitEcon.arpu'),
          min: 0 }}
        data-testid="ue-input-arpu"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={`${t('unitEcon.churn')} (%)`}
        type="number" value={churn}
        onChange={(e) =>
          onChange('churn', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{ 'aria-label': t('unitEcon.churn'),
          min: 0, max: 100 }}
        data-testid="ue-input-churn"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={`${t('unitEcon.cogs')} (%)`}
        type="number" value={cogs}
        onChange={(e) =>
          onChange('cogs', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{ 'aria-label': t('unitEcon.cogs'),
          min: 0, max: 100 }}
        data-testid="ue-input-cogs"
        fullWidth sx={{ mb: 2 }} />
    </>
  );
};

export default UnitEconInputFields;
