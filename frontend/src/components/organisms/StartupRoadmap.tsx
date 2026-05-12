'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress from '@shared/m3/LinearProgress';
import { useTranslations } from 'next-intl';
import { usePlannerProgress } from '@/hooks';
import { PlanPhaseCard } from '@/components/molecules';
import { PlannerResetButton } from '@/components/molecules/PlannerResetButton';
import { PlannerHeader } from '@/components/molecules/PlannerHeader';
import { PriorityBadge } from '@/components/molecules/PriorityBadge';
import { useAppSelector } from '@/store/hooks';
import roadmap from '@/constants/startup-roadmap.json';

/** Map of biggest-challenge slug → highlighted phase id. */
const CHALLENGE_PHASE: Record<string, string> = {
  'finding-customers': 'validate',
  'building-product': 'build',
  'legal-compliance': 'legal',
  'fundraising': 'finance',
  'market-research': 'validate',
};

/** Props for StartupRoadmap. */
export interface StartupRoadmapProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Full startup roadmap organism with personalisation.
 * Shows a setup prompt when onboarding is incomplete and
 * highlights the phase matching the user's biggest challenge.
 */
export const StartupRoadmap: React.FC<
  StartupRoadmapProps
> = ({ testId = 'startup-roadmap' }) => {
  const t = useTranslations('planner');
  const {
    completedSteps, phases, toggle, reset,
    overallPct, totalDone, totalSteps,
  } = usePlannerProgress();

  const { selectedSlug, onboardingComplete,
    biggestChallenge } = useAppSelector(
    (s) => s.startupType,
  );
  const highlightedPhase = biggestChallenge
    ? (CHALLENGE_PHASE[biggestChallenge] ?? null)
    : null;

  return (
    <Box data-testid={testId} aria-label={t('pageTitle')}>
      <PlannerHeader
        selectedSlug={selectedSlug}
        onboardingComplete={onboardingComplete}
      />
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline', mb: 0.5 }}>
          <Typography variant="body2"
            sx={{ fontWeight: 600 }}>
            {t('overallProgress')}
          </Typography>
          <Typography variant="caption"
            color="text.secondary">
            {t('stepsOf', {
              done: totalDone, total: totalSteps,
            })}
          </Typography>
        </Box>
        <LinearProgress variant="determinate"
          value={overallPct}
          aria-label="Overall startup progress"
          sx={{ height: 10, borderRadius: 5 }} />
      </Box>
      {roadmap.phases.map((phase, i) => (
        <Box key={phase.id}>
          {phase.id === highlightedPhase && (
            <PriorityBadge />
          )}
          <PlanPhaseCard
            testId={`phase-card-${phase.id}`}
            phase={phases[i]}
            steps={phase.steps}
            completedSteps={completedSteps}
            onToggle={toggle}
          />
        </Box>
      ))}
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <PlannerResetButton onReset={reset} />
      </Box>
    </Box>
  );
};

export default StartupRoadmap;
