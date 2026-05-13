'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import PersonIcon from '@shared/icons/Person';
import { Users as GroupIcon } from '@shared/icons/Users';
import { useTranslations } from 'next-intl';
import type { CoFounderStatus }
  from '@/store/slices/startupTypeSlice';

/** Props for OnboardingStep4. */
export interface OnboardingStep4Props {
  /** Current co-founder status selection. */
  value: CoFounderStatus | null;
  /** Called when the user picks a status. */
  onChange: (v: CoFounderStatus) => void;
}

/**
 * Step 4 of the onboarding wizard — team status toggle.
 *
 * @param props - Current value and change handler.
 * @returns Two large toggle buttons for team status.
 */
export const OnboardingStep4: React.FC<
  OnboardingStep4Props
> = ({ value, onChange }) => {
  const t = useTranslations('onboarding');

  return (
    <Box
      display="flex"
      gap={2}
      flexWrap="wrap"
      data-testid="onboarding-step4"
    >
      <Button
        variant={
          value === 'solo' ? 'contained' : 'outlined'
        }
        startIcon={<PersonIcon />}
        onClick={() => onChange('solo')}
        aria-pressed={value === 'solo'}
        data-testid="team-solo-btn"
        sx={{ flex: 1, py: 2, minWidth: 140 }}
      >
        {t('solo')}
      </Button>
      <Button
        variant={
          value === 'with-cofounders'
            ? 'contained'
            : 'outlined'
        }
        startIcon={<GroupIcon />}
        onClick={() => onChange('with-cofounders')}
        aria-pressed={value === 'with-cofounders'}
        data-testid="team-cofounders-btn"
        sx={{ flex: 1, py: 2, minWidth: 140 }}
      >
        {t('withCofounders')}
      </Button>
    </Box>
  );
};

export default OnboardingStep4;
