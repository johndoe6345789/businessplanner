'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import { OnboardingStep1 } from './OnboardingStep1';
import { StartupTypeSelector } from './StartupTypeSelector';
import { StageSelector } from './StageSelector';
import { OnboardingStep4 } from './OnboardingStep4';
import { OnboardingStep5 } from './OnboardingStep5';
import type { CoFounderStatus }
  from '@/store/slices/startupTypeSlice';

/** Props for WizardStepContent. */
export interface WizardStepContentProps {
  /** Current step index (0-based). */
  step: number;
  /** Startup name value. */
  name: string;
  /** Selected type slug. */
  slug: string | null;
  /** Selected stage slug. */
  stage: string | null;
  /** Team/co-founder status. */
  team: CoFounderStatus | null;
  /** Biggest challenge slug. */
  challenge: string | null;
  /** Handler for startup name changes. */
  onName: (v: string) => void;
  /** Handler for type slug changes. */
  onSlug: (v: string) => void;
  /** Handler for stage changes. */
  onStage: (v: string) => void;
  /** Handler for team status changes. */
  onTeam: (v: CoFounderStatus) => void;
  /** Handler for challenge changes. */
  onChallenge: (v: string) => void;
}

/**
 * Renders the content area for the current wizard step.
 *
 * @param props - All wizard form state and change handlers.
 * @returns The active step's content molecule.
 */
export const WizardStepContent: React.FC<
  WizardStepContentProps
> = ({
  step, name, slug, stage, team, challenge,
  onName, onSlug, onStage, onTeam, onChallenge,
}) => (
  <Box sx={{ mb: 4 }}>
    {step === 0 && (
      <OnboardingStep1 value={name} onChange={onName} />
    )}
    {step === 1 && (
      <StartupTypeSelector
        selectedSlug={slug}
        onSelect={onSlug}
      />
    )}
    {step === 2 && slug && (
      <StageSelector
        typeSlug={slug}
        selectedStage={stage}
        onSelect={onStage}
      />
    )}
    {step === 3 && (
      <OnboardingStep4 value={team} onChange={onTeam} />
    )}
    {step === 4 && (
      <OnboardingStep5
        value={challenge}
        onChange={onChallenge}
      />
    )}
  </Box>
);

export default WizardStepContent;
