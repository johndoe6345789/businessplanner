'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';

/** Props for OnboardingStep1. */
export interface OnboardingStep1Props {
  /** Current startup name value. */
  value: string;
  /** Called on input change. */
  onChange: (v: string) => void;
}

/**
 * Step 1 of the onboarding wizard — startup name input.
 *
 * @param props - Value and change handler.
 * @returns Text field for entering a startup name.
 */
export const OnboardingStep1: React.FC<
  OnboardingStep1Props
> = ({ value, onChange }) => {
  const t = useTranslations('onboarding');

  return (
    <TextField
      label={t('startupNameLabel')}
      placeholder={t('startupNamePlaceholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputProps={{
        maxLength: 60,
        'aria-label': t('startupNameLabel'),
      }}
      fullWidth
      data-testid="onboarding-name-input"
      autoFocus
    />
  );
};

export default OnboardingStep1;
