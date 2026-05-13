'use client';

/**
 * @file FounderProfileCard.tsx
 * @brief Public founder profile card organism.
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import type { PublicProfile } from '@/types/publicProfile';
import FounderProfileHeader
  from './FounderProfileHeader';
import FounderProfileStats
  from './FounderProfileStats';

/** Props for FounderProfileCard. */
export interface FounderProfileCardProps {
  /** Public profile data to display. */
  profile: PublicProfile;
}

/**
 * Displays a founder's public profile card.
 *
 * @param props - Component props.
 * @returns Profile card element.
 */
export const FounderProfileCard: React.FC<
  FounderProfileCardProps
> = ({ profile }) => {
  const t = useTranslations('founderProfile');

  return (
    <Box
      data-testid="founder-profile-card"
      aria-label={t('cardLabel', {
        name: profile.displayName,
      })}
      sx={{ maxWidth: 480, mx: 'auto', p: 3,
            borderRadius: 3, boxShadow: 1 }}
    >
      <FounderProfileHeader profile={profile} />

      {profile.bio && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {profile.bio}
        </Typography>
      )}

      <FounderProfileStats profile={profile} />

      <Button
        variant="contained" fullWidth
        aria-label={t('followLabel', {
          name: profile.displayName,
        })}
        data-testid="founder-follow-btn"
      >
        {t('follow')}
      </Button>
    </Box>
  );
};

export default FounderProfileCard;
