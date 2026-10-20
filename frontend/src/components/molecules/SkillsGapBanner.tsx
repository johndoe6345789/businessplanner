'use client';

/**
 * @file SkillsGapBanner.tsx
 * @brief Dismissible banner shown on the planner when
 *        the user is missing 2+ critical skills for
 *        their startup type.
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Alert from '@shared/m3/Alert';
import { useSkillsGap } from '@/hooks/useSkillsGap';
import { useAppSelector } from '@/store/hooks';

const MIN_MISSING = 2;

/**
 * Shows a dismissible warning when 2 or more critical
 * skills are missing for the selected startup type.
 *
 * @returns Gap banner or null.
 */
const SkillsGapBanner: React.FC = () => {
  const t = useTranslations('skillsGap');
  const [dismissed, setDismissed] = useState(false);
  const selectedSlug = useAppSelector(
    (s) => s.startupType.selectedSlug,
  );
  const { missingSkills } = useSkillsGap();

  if (
    dismissed
    || !selectedSlug
    || missingSkills.length < MIN_MISSING
  ) {
    return null;
  }

  const missingList = missingSkills.join(', ');

  return (
    <Alert
      severity="warning"
      onClose={() => setDismissed(true)}
      data-testid="skills-gap-banner"
      aria-label={t('bannerLabel')}
      sx={{ mb: 2 }}
    >
      {t('message', {
        skills: missingList,
        type: selectedSlug,
      })}
    </Alert>
  );
};

export default SkillsGapBanner;
