'use client';

/**
 * @file FounderProfileHeader.tsx
 * @brief Avatar, name, username, startup chips, and
 *        mentor badge for the founder profile card.
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import Avatar from '@shared/m3/Avatar';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import type { PublicProfile } from '@/types/publicProfile';

/** Props for FounderProfileHeader. */
export interface FounderProfileHeaderProps {
  /** Public profile data. */
  profile: PublicProfile;
}

/**
 * Avatar row, display name, startup name, type chips.
 *
 * @param props - Component props.
 * @returns Header section element.
 */
const FounderProfileHeader: React.FC<
  FounderProfileHeaderProps
> = ({ profile }) => {
  const t = useTranslations('founderProfile');
  const initials = profile.displayName
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Box sx={{ display: 'flex',
                 alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar sx={{ width: 64, height: 64 }}
                aria-label={profile.displayName}>
          {initials}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {profile.displayName}
          </Typography>
          <Typography variant="body2"
                      color="text.secondary">
            @{profile.username}
          </Typography>
        </Box>
      </Box>

      {profile.startupName && (
        <Typography variant="subtitle1" gutterBottom>
          {profile.startupName}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap',
                 gap: 1, mb: 2 }}>
        {profile.startupType && (
          <Chip label={profile.startupType}
                size="small" color="primary"
                variant="outlined" />
        )}
        {profile.stage && (
          <Chip label={profile.stage}
                size="small" variant="outlined" />
        )}
        {profile.is_mentor && (
          <Chip label={t('mentorBadge')}
                size="small" color="secondary"
                data-testid="mentor-badge" />
        )}
      </Box>
    </>
  );
};

export default FounderProfileHeader;
