'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTranslations } from 'next-intl';

/** Props for OnboardingStep5. */
export interface OnboardingStep5Props {
  /** Current challenge slug value. */
  value: string | null;
  /** Called when the user picks a challenge. */
  onChange: (v: string) => void;
}

/** Challenge option shape. */
interface ChallengeOption {
  value: string;
  labelKey: keyof ReturnType<
    ReturnType<typeof useTranslations<'onboarding'>>
  >;
}

const CHALLENGES: Array<{
  value: string;
  labelKey: string;
}> = [
  { value: 'finding-customers', labelKey: 'findingCustomers' },
  { value: 'building-product', labelKey: 'buildingProduct' },
  { value: 'legal-compliance', labelKey: 'legalCompliance' },
  { value: 'fundraising', labelKey: 'fundraising' },
  { value: 'team-building', labelKey: 'teamBuilding' },
  { value: 'market-research', labelKey: 'marketResearch' },
  { value: 'staying-motivated', labelKey: 'stayingMotivated' },
];

/**
 * Step 5 of the onboarding wizard — biggest challenge select.
 *
 * @param props - Current value and change handler.
 * @returns MUI Select with challenge options.
 */
export const OnboardingStep5: React.FC<
  OnboardingStep5Props
> = ({ value, onChange }) => {
  const t = useTranslations('onboarding');
  const labelId = 'biggest-challenge-label';

  return (
    <Box
      data-testid="onboarding-step5"
      sx={{ maxWidth: 480 }}
    >
      <FormControl fullWidth>
        <InputLabel id={labelId}>
          {t('biggestChallengeLabel')}
        </InputLabel>
        <Select
          labelId={labelId}
          value={value ?? ''}
          label={t('biggestChallengeLabel')}
          onChange={(e) => onChange(e.target.value)}
          inputProps={{
            'data-testid': 'challenge-select',
            'aria-label': t('biggestChallengeLabel'),
          }}
        >
          {CHALLENGES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {t(
                c.labelKey as Parameters<
                  typeof t
                >[0],
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default OnboardingStep5;
