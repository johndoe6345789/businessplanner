'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress from '@shared/m3/LinearProgress';
import { useTranslations } from 'next-intl';
import { usePlannerProgress } from '@/hooks';
import { PlanPhaseCard } from '@/components/molecules';
import roadmap from '@/constants/startup-roadmap.json';

/** Props for StartupRoadmap. */
export interface StartupRoadmapProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Full startup roadmap organism.
 * Renders an overall progress bar followed by one
 * PlanPhaseCard per roadmap phase.
 */
export const StartupRoadmap: React.FC<
  StartupRoadmapProps
> = ({ testId = 'startup-roadmap' }) => {
  const t = useTranslations('planner');
  const {
    completedSteps,
    phases,
    toggle,
    reset,
    overallPct,
    totalDone,
    totalSteps,
  } = usePlannerProgress();

  return (
    <Box
      data-testid={testId}
      aria-label={t('pageTitle')}
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline', mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600 }}
          >
            {t('overallProgress')}
          </Typography>
          <Typography variant="caption"
            color="text.secondary">
            {t('stepsOf', {
              done: totalDone, total: totalSteps,
            })}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={overallPct}
          aria-label="Overall startup progress"
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
      {roadmap.phases.map((phase, i) => (
        <PlanPhaseCard
          key={phase.id}
          testId={`phase-card-${phase.id}`}
          phase={phases[i]}
          steps={phase.steps}
          completedSteps={completedSteps}
          onToggle={toggle}
        />
      ))}
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Typography
          component="button"
          variant="caption"
          color="text.disabled"
          onClick={() => {
            if (window.confirm(t('resetConfirm'))) {
              reset();
            }
          }}
          aria-label={t('reset')}
          data-testid="reset-progress"
          sx={{
            background: 'none', border: 'none',
            cursor: 'pointer', p: 0,
          }}
        >
          {t('reset')}
        </Typography>
      </Box>
    </Box>
  );
};

export default StartupRoadmap;
