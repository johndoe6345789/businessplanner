'use client';

/**
 * Unit economics result display molecule.
 * @module components/molecules/UnitEconResultDisplay
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import type { UnitEconResult } from '@/types/financials';

const STATUS_COLORS = {
  good: 'success.main',
  warn: 'warning.main',
  poor: 'error.main',
} as const;

/** Props for UnitEconResultDisplay. */
export interface UnitEconResultDisplayProps {
  /** Computed unit economics result. */
  result: UnitEconResult;
  /** Called when save button is clicked. */
  onSave: () => void;
}

/**
 * Shows LTV, ratio, payback, margin, and save button.
 * @param props - UnitEconResultDisplayProps.
 * @returns UnitEconResultDisplay UI.
 */
export const UnitEconResultDisplay: React.FC<
  UnitEconResultDisplayProps
> = ({ result, onSave }) => {
  const t = useTranslations('financials');
  const tc = useTranslations('common');
  const fmt = (v: number) =>
    isFinite(v) ? v.toFixed(2) : '∞';
  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap',
        gap: 2, mb: 2 }}>
        <Typography
          sx={{ color: STATUS_COLORS[result.status] }}>
          {t('unitEcon.ltv')}: £{fmt(result.ltv_gbp)}
        </Typography>
        <Typography
          sx={{ color: STATUS_COLORS[result.status] }}>
          {t('unitEcon.ltvCac')}: {fmt(result.ltv_cac_ratio)}
        </Typography>
        <Typography>
          {t('unitEcon.payback')}: {fmt(result.payback_months)} mo
        </Typography>
        <Typography>
          {t('unitEcon.grossMargin')}: {result.gross_margin_pct}%
        </Typography>
      </Box>
      <Button onClick={onSave}
        aria-label={tc('save')}
        data-testid="ue-save-btn" variant="contained">
        {tc('save')}
      </Button>
    </>
  );
};

export default UnitEconResultDisplay;
