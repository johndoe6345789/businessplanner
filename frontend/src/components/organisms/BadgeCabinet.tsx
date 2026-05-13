'use client';

import React from 'react';
import Grid from '@shared/m3/Grid';
import Skeleton from '@shared/m3/Skeleton';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import {
  useGetAllBadgesQuery,
} from '@/store/api/gamificationApi';
import { useGamification } from '@/hooks';
import { BadgeCard } from '../molecules/BadgeCard';

/**
 * Grid of all system badges. Earned badges are
 * shown in colour; unearned are greyscale + locked.
 */
export const BadgeCabinet: React.FC = () => {
  const t = useTranslations('gamification');
  const {
    data: all,
    isLoading: loadingBadges,
  } = useGetAllBadgesQuery();
  const {
    progress,
    isLoading: loadingProgress,
  } = useGamification();

  const loading = loadingBadges || loadingProgress;

  const earnedMap = new Map(
    (progress?.badges ?? []).map((b) => [
      b.id, b.earnedAt,
    ]),
  );

  if (loading) {
    return (
      <Box
        data-testid="badge-cabinet"
        aria-label={t('badges')}
        aria-busy="true"
      >
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} item xs={6} sm={4} md={3}>
              <Skeleton
                variant="rectangular"
                height={120}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!all || all.length === 0) {
    return (
      <Box data-testid="badge-cabinet">
        <Typography color="text.secondary">
          {t('noBadgesYet')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      data-testid="badge-cabinet"
      aria-label={t('badges')}
    >
      <Grid container spacing={2}>
        {all.map((badge) => {
          const earned = earnedMap.has(badge.id);
          const at = earnedMap.get(badge.id);
          return (
            <Grid
              key={badge.id}
              item xs={6} sm={4} md={3}
            >
              <BadgeCard
                badge={badge}
                earned={earned}
                earnedAt={at}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BadgeCabinet;
