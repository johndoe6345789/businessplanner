'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { XPBar } from '@/components/atoms/XPBar';
import {
  StreakCounter,
} from '@/components/atoms/StreakCounter';
import type { GamificationProgress }
  from '@/types/gamification';

/** Props for the full dashboard gamification view. */
export interface GamificationSummaryFullProps {
  /** User progress data. */
  progress: GamificationProgress;
}

/**
 * Full gamification widget for the Dashboard.
 * Shows XPBar, streak counter, and badge count.
 *
 * @param props - Component props.
 * @returns Full gamification summary element.
 */
export const GamificationSummaryFull: React.FC<
  GamificationSummaryFullProps
> = ({ progress }) => {
  const t = useTranslations('gamification');

  return (
    <Box sx={{ width: '100%' }}>
      <XPBar
        points={progress.points}
        nextLevelAt={progress.nextLevelAt}
        level={progress.level}
        levelTitle={progress.levelTitle}
        showLabel
      />
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 1,
          alignItems: 'center',
        }}
      >
        <StreakCounter
          streak={progress.currentStreak}
          size="md"
        />
        <Typography variant="body2">
          {`${progress.badges.length} ${t('badges')}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default GamificationSummaryFull;
