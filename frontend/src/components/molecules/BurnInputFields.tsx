'use client';

/**
 * Burn rate number input fields molecule.
 * @module components/molecules/BurnInputFields
 */
import React from 'react';
import TextField from '@shared/m3/TextField';
import { useTranslations } from 'next-intl';

/** Props for BurnInputFields. */
export interface BurnInputFieldsProps {
  /** Monthly burn in GBP. */
  burn: number;
  /** Cash in bank in GBP. */
  cash: number;
  /** Monthly revenue in GBP (£0 valid — D29). */
  revenue: number;
  /** Called on each field value change: field + value. */
  onChange: (field: 'burn' | 'cash' | 'revenue',
    value: number) => void;
  /** Called when any field loses focus. */
  onBlur: () => void;
}

/**
 * Three number inputs for burn rate calculation.
 * @param props - BurnInputFieldsProps.
 * @returns BurnInputFields UI.
 */
export const BurnInputFields: React.FC<
  BurnInputFieldsProps
> = ({ burn, cash, revenue, onChange, onBlur }) => {
  const t = useTranslations('financials');
  return (
    <>
      <TextField label={`${t('burn.monthlyBurn')} (£)`}
        type="number" value={burn}
        onChange={(e) =>
          onChange('burn', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{ 'aria-label': t('burn.monthlyBurn'),
          min: 0 }}
        data-testid="burn-input-monthly"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={`${t('burn.cashInBank')} (£)`}
        type="number" value={cash}
        onChange={(e) =>
          onChange('cash', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{ 'aria-label': t('burn.cashInBank'),
          min: 0 }}
        data-testid="burn-input-cash"
        fullWidth sx={{ mb: 2 }} />
      <TextField label={`${t('burn.monthlyRevenue')} (£)`}
        type="number" value={revenue}
        onChange={(e) =>
          onChange('revenue', Number(e.target.value))}
        onBlur={onBlur}
        inputProps={{ 'aria-label': t('burn.monthlyRevenue'),
          min: 0 }}
        data-testid="burn-input-revenue"
        fullWidth sx={{ mb: 2 }} />
    </>
  );
};

export default BurnInputFields;
