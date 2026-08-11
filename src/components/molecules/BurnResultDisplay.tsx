'use client';

/**
 * Burn rate result display molecule.
 * @module components/molecules/BurnResultDisplay
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import type { BurnResult } from '@/types/financials';

const STATUS_COLORS = {
  safe: 'success.main',
  warn: 'warning.main',
  critical: 'error.main',
} as const;

/** Props for BurnResultDisplay. */
export interface BurnResultDisplayProps {
  /** Computed burn result to display. */
  result: BurnResult;
  /** Called when save button is clicked. */
  onSave: () => void;
}

/**
 * Shows net burn, runway, and save button.
 * @param props - BurnResultDisplayProps.
 * @returns BurnResultDisplay UI.
 */
export const BurnResultDisplay: React.FC<
  BurnResultDisplayProps
> = ({ result, onSave }) => {
  const t = useTranslations('financials');
  const runwayLabel = isFinite(result.runway_months)
    ? result.runway_months.toFixed(1)
    : '∞';
  return (
    <>
      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <Typography>
          {t('burn.netBurn')}: £
          {result.net_burn_gbp.toFixed(0)}
        </Typography>
        <Typography
          sx={{ color: STATUS_COLORS[result.status] }}>
          {t('burn.runway')}: {runwayLabel} mo
        </Typography>
      </Box>
      <Button onClick={onSave}
        aria-label={t('burn.save')}
        data-testid="burn-save-btn"
        variant="contained">
        {t('burn.save')}
      </Button>
    </>
  );
};

export default BurnResultDisplay;
