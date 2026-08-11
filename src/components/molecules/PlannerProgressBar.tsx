'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress from '@shared/m3/LinearProgress';
import { useTranslations } from 'next-intl';

/** Props for PlannerProgressBar. */
export interface PlannerProgressBarProps {
  /** Percentage complete (0–100). */
  pct: number;
  /** Number of completed steps. */
  done: number;
  /** Total number of steps. */
  total: number;
}

/**
 * Overall-progress bar for the planner page.
 *
 * @param props - pct, done, and total step counts.
 * @returns Labelled linear progress bar.
 */
export const PlannerProgressBar: React.FC<
  PlannerProgressBarProps
> = ({ pct, done, total }) => {
  const t = useTranslations('planner');
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        mb: 0.5,
      }}>
        <Typography variant="body2"
          sx={{ fontWeight: 600 }}>
          {t('overallProgress')}
        </Typography>
        <Typography variant="caption"
          color="text.secondary">
          {t('stepsOf', { done, total })}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={pct}
        aria-label="Overall startup progress"
        sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  );
};

export default PlannerProgressBar;
