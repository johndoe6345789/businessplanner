'use client';

import React from 'react';
import Chip from '@mui/material/Chip';
import { useTranslations } from 'next-intl';
import type { RiskLevel }
  from '@/hooks/startupCompareUtils';

/** Props for RiskLevelChip. */
export interface RiskLevelChipProps {
  /** Colour-coded risk band to display. */
  readonly level: RiskLevel;
}

type ChipColor =
  'success' | 'warning' | 'error' | 'default';

const LEVEL_COLOR: Record<RiskLevel, ChipColor> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

/**
 * Colour-coded chip for a startup risk level.
 *
 * @param props - RiskLevelChipProps.
 * @returns Styled MUI Chip.
 */
const RiskLevelChip: React.FC<RiskLevelChipProps> = (
  { level },
) => {
  const t = useTranslations('startupCompare');
  const label = t(`level.${level}`);
  return (
    <Chip
      label={label}
      color={LEVEL_COLOR[level]}
      size="small"
      aria-label={label}
      data-testid={`risk-level-chip-${level}`}
      sx={{
        fontWeight: 700,
        opacity: level === 'critical' ? 0.85 : 1,
      }}
    />
  );
};

export default RiskLevelChip;
