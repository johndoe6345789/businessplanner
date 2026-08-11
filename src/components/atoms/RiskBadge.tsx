'use client';

import React from 'react';
import Chip from '@mui/material/Chip';
import { useTranslations } from 'next-intl';

/** Props for RiskBadge. */
export interface RiskBadgeProps {
  /**
   * Pre-computed risk score (probability × impact).
   * Range 1–25.
   */
  score: number;
}

/** Map score ranges to MUI color tokens. */
function scoreColor(
  score: number,
): 'success' | 'warning' | 'error' | 'default' {
  if (score <= 4) return 'success';
  if (score <= 9) return 'warning';
  if (score <= 15) return 'error';
  return 'error';
}

/** Map score ranges to severity label keys. */
function severityKey(score: number): string {
  if (score <= 4) return 'low';
  if (score <= 9) return 'medium';
  if (score <= 15) return 'high';
  return 'critical';
}

/**
 * Colour-coded chip displaying the risk score and
 * its severity label (Low / Medium / High / Critical).
 *
 * @param props - Score value.
 * @returns Styled MUI Chip.
 */
const RiskBadge: React.FC<RiskBadgeProps> = (
  { score },
) => {
  const t = useTranslations('riskAssessment');
  const key = severityKey(score);
  return (
    <Chip
      label={`${score} · ${t(`severity.${key}`)}`}
      color={scoreColor(score)}
      size="small"
      aria-label={
        `${t('scoreLabel')} ${score}, `
        + `${t(`severity.${key}`)}`
      }
      data-testid={`risk-badge-${key}`}
      sx={{ fontWeight: 700, minWidth: 80 }}
    />
  );
};

export default RiskBadge;
