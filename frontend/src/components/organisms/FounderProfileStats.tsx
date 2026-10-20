'use client';

/**
 * @file FounderProfileStats.tsx
 * @brief Streak and badge count stats row for the
 *        founder public profile card.
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import type { PublicProfile } from '@/types/publicProfile';

/** Props for FounderProfileStats. */
export interface FounderProfileStatsProps {
  /** Public profile data. */
  profile: PublicProfile;
}

/**
 * Renders streak and badge count for a founder profile.
 *
 * @param props - Component props.
 * @returns Stats row element.
 */
const FounderProfileStats: React.FC<
  FounderProfileStatsProps
> = ({ profile }) => {
  const t = useTranslations('founderProfile');

  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700}>
          {profile.current_streak}
        </Typography>
        <Typography
          variant="caption" color="text.secondary"
        >
          {t('streak')}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700}>
          {profile.badge_count}
        </Typography>
        <Typography
          variant="caption" color="text.secondary"
        >
          {t('badges')}
        </Typography>
      </Box>
    </Box>
  );
};

export default FounderProfileStats;
