'use client';

/**
 * Header section for a plan phase card.
 * @module components/molecules/PlanPhaseHeader
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress
  from '@shared/m3/LinearProgress';
import { useTranslations } from 'next-intl';
import type { PhaseProgress } from '@/hooks';

/** Props for PlanPhaseHeader. */
interface PlanPhaseHeaderProps {
  /** Phase metadata and progress. */
  phase: PhaseProgress;
}

/**
 * Title, description, and progress bar for a phase.
 */
export const PlanPhaseHeader: React.FC<
  PlanPhaseHeaderProps
> = ({ phase }) => {
  const t = useTranslations('planner');
  const statusColor =
    phase.status === 'complete' ? 'success.main'
    : phase.status === 'in-progress' ? 'primary.main'
    : 'text.disabled';
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="h6" component="h2"
        sx={{ fontWeight: 700 }}
      >
        {t(`phases.${phase.id}.title`)}
      </Typography>
      <Typography
        variant="body2" color="text.secondary"
      >
        {t(`phases.${phase.id}.desc`)}
      </Typography>
      <Box sx={{ display: 'flex',
        alignItems: 'center', gap: 1, mt: 1 }}>
        <LinearProgress
          variant="determinate"
          value={phase.pct}
          aria-label={`${phase.id} progress`}
          sx={{ flex: 1, height: 6, borderRadius: 3 }}
        />
        <Typography
          variant="caption"
          sx={{ color: statusColor, fontWeight: 600,
            whiteSpace: 'nowrap' }}
        >
          {t('stepsOf', {
            done: phase.done, total: phase.total,
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default PlanPhaseHeader;
