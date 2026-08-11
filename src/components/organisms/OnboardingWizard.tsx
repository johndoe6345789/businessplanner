'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/store/hooks';
import {
  setStartupType, setOnboardingComplete,
  setOnboardingData, type CoFounderStatus,
} from '@/store/slices/startupTypeSlice';
import { useRouter } from 'next/navigation';
import { WizardStepContent } from '@/components/molecules/WizardStepContent';
import { WizardNavButtons } from '@/components/molecules/WizardNavButtons';

const STEP_COUNT = 5;

function isStepValid(
  step: number, name: string,
  slug: string | null, stage: string | null,
  team: CoFounderStatus | null,
  challenge: string | null,
): boolean {
  const checks = [
    name.trim().length > 0, slug !== null,
    stage !== null, team !== null, challenge !== null,
  ];
  return checks[step] ?? true;
}

/**
 * Five-step onboarding wizard. Commits to Redux and
 * navigates to /planner on finish.
 * @returns Stepper wizard organism.
 */
export const OnboardingWizard: React.FC = () => {
  const t = useTranslations('onboarding');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [team, setTeam] =
    useState<CoFounderStatus | null>(null);
  const [challenge, setChallenge] =
    useState<string | null>(null);

  const stepTitles = [
    t('step1Title'), t('step2Title'), t('step3Title'),
    t('step4Title'), t('step5Title'),
  ];
  const valid = isStepValid(
    step, name, slug, stage, team, challenge,
  );

  const handleNext = () => {
    if (!valid) return;
    if (step < STEP_COUNT - 1) { setStep(step + 1); return; }
    if (slug) dispatch(setStartupType(slug));
    dispatch(setOnboardingData({
      startupName: name, selectedStage: stage,
      coFounderStatus: team, biggestChallenge: challenge,
    }));
    dispatch(setOnboardingComplete(true));
    router.push('planner');
  };

  return (
    <Box data-testid="onboarding-wizard">
      <Stepper activeStep={step} alternativeLabel
        sx={{ mb: 4 }}>
        {stepTitles.map((l) => (
          <Step key={l}><StepLabel>{l}</StepLabel></Step>
        ))}
      </Stepper>
      <Typography variant="h6" gutterBottom>
        {stepTitles[step]}
      </Typography>
      <WizardStepContent
        step={step} name={name} slug={slug}
        stage={stage} team={team} challenge={challenge}
        onName={setName} onSlug={setSlug}
        onStage={setStage} onTeam={setTeam}
        onChallenge={setChallenge}
      />
      <WizardNavButtons
        step={step} stepCount={STEP_COUNT} valid={valid}
        onBack={() => setStep(step - 1)}
        onNext={handleNext}
      />
    </Box>
  );
};

export default OnboardingWizard;
