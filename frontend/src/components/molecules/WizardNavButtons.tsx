'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@mui/material/Button';
import { useTranslations } from 'next-intl';

/** Props for WizardNavButtons. */
export interface WizardNavButtonsProps {
  /** Current step index (0-based). */
  step: number;
  /** Total number of steps. */
  stepCount: number;
  /** Whether the current step passes validation. */
  valid: boolean;
  /** Called when the user clicks Back. */
  onBack: () => void;
  /** Called when the user clicks Next or Complete. */
  onNext: () => void;
}

/**
 * Back / Next navigation buttons for the onboarding wizard.
 *
 * @param props - Step position, validity, and callbacks.
 * @returns Navigation row with back and next/complete buttons.
 */
export const WizardNavButtons: React.FC<
  WizardNavButtonsProps
> = ({ step, stepCount, valid, onBack, onNext }) => {
  const t = useTranslations('onboarding');
  const isLast = step === stepCount - 1;

  return (
    <Box
      display="flex"
      gap={2}
      justifyContent="flex-end"
      data-testid="wizard-nav"
    >
      {step > 0 && (
        <Button
          variant="outlined"
          onClick={onBack}
          aria-label={t('back')}
          data-testid="wizard-back-btn"
        >
          {t('back')}
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onNext}
        disabled={!valid}
        aria-label={isLast ? t('complete') : t('next')}
        data-testid="wizard-next-btn"
      >
        {isLast ? t('complete') : t('next')}
      </Button>
    </Box>
  );
};

export default WizardNavButtons;
