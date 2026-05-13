'use client';

/**
 * @file FounderProfilePageClient.tsx
 * @brief Client wrapper that fetches and renders a
 *        founder's public profile card.
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import CircularProgress from '@shared/m3/CircularProgress';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import {
  useGetPublicProfileQuery,
} from '@/store/api/publicProfileApi';
import FounderProfileCard from './FounderProfileCard';

/** Props for FounderProfilePageClient. */
export interface FounderProfilePageClientProps {
  /** Username from the URL path. */
  username: string;
}

/**
 * Fetches and renders the public founder profile.
 *
 * @param props - Component props.
 * @returns Profile card or loading/error state.
 */
const FounderProfilePageClient: React.FC<
  FounderProfilePageClientProps
> = ({ username }) => {
  const t = useTranslations('founderProfile');
  const { data, isLoading, isError } =
    useGetPublicProfileQuery(username);

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center', py: 8,
      }}>
        <CircularProgress aria-label={t('loading')} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Typography
        color="text.secondary"
        data-testid="founder-profile-not-found"
      >
        {t('notFound')}
      </Typography>
    );
  }

  return <FounderProfileCard profile={data} />;
};

export default FounderProfilePageClient;
