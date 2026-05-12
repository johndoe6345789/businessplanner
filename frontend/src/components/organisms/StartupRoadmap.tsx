'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import { usePlannerProgress } from '@/hooks';
import {
  PlanPhaseCard, PlannerHeader, PlannerResetButton,
  PriorityBadge,
} from '@/components/molecules';
import { StageGateBar }
  from '@/components/molecules/StageGateBar';
import { PlannerProgressBar }
  from '@/components/molecules/PlannerProgressBar';
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

  const {
    selectedSlug, onboardingComplete,
    biggestChallenge, selectedStage,
  } = useAppSelector((s) => s.startupType);
  const highlightedPhase = biggestChallenge
    ? (CHALLENGE_PHASE[biggestChallenge] ?? null)
    : null;

  return (
    <Box data-testid={testId} aria-label={t('pageTitle')}>
      <PlannerHeader
        selectedSlug={selectedSlug}
        onboardingComplete={onboardingComplete}
      />
      {onboardingComplete && selectedSlug &&
        selectedStage && (
        <StageGateBar
          typeSlug={selectedSlug}
          currentStage={selectedStage}
        />
      )}
      <PlannerProgressBar
        pct={overallPct}
        done={totalDone}
        total={totalSteps}
      />
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
