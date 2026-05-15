'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useTranslations } from 'next-intl';
import {
  useStartupComparison,
} from '@/hooks/useStartupComparison';
import { StartupScoreCard }
  from '@/components/molecules/StartupScoreCard';

/**
 * Renders the full startup comparison board.
 * Shows a "Best Pick" banner for the lowest-risk
 * company and a ranked list of score cards.
 *
 * @returns Comparison board UI.
 */
export const StartupCompareBoard: React.FC = () => {
  const t = useTranslations('startupCompare');
  const { profiles, isLoading, isError } =
    useStartupComparison();

  if (isLoading) {
    return (
      <Box
        data-testid="compare-board-loading"
        sx={{ display: 'flex',
          flexDirection: 'column', gap: 2 }}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rounded"
            height={140} />
        ))}
      </Box>
    );
  }

  if (isError || profiles.length === 0) {
    return (
      <Typography
        data-testid="compare-board-empty"
        color="text.secondary"
        aria-label={t('empty')}>
        {t('empty')}
      </Typography>
    );
  }

  const [best, ...rest] = profiles;

  return (
    <Box
      data-testid="compare-board"
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom
          aria-label={t('bestPick')}>
          {t('bestPick')}
        </Typography>
        <Typography variant="body2"
          color="text.secondary" gutterBottom>
          {t('bestPickSub')}
        </Typography>
        <StartupScoreCard
          profile={best} isBest />
      </Box>
      {rest.length > 0 && (
        <Box sx={{ display: 'flex',
          flexDirection: 'column', gap: 2 }}>
          {rest.map((p) => (
            <StartupScoreCard
              key={p.org.id} profile={p} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default StartupCompareBoard;
