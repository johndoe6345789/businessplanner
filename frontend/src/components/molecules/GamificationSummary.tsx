'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Skeleton from '@shared/m3/Skeleton';
import { useTranslations } from 'next-intl';
import { useGamification } from '@/hooks';
import { LevelBadge } from '@/components/atoms/LevelBadge';
import {
  StreakCounter,
} from '@/components/atoms/StreakCounter';
import {
  GamificationSummaryFull,
} from './GamificationSummaryFull';

/** Props for the GamificationSummary molecule. */
export interface GamificationSummaryProps {
  /** compact=true → Navbar; false → Dashboard. */
  compact?: boolean;
}

/** Compact skeleton for Navbar loading state. */
const CompactSkeleton: React.FC = () => (
  <Box
    sx={{ display: 'flex', gap: 1 }}
    component="span"
    data-testid="gamification-summary"
  >
    <Skeleton variant="circular" width={28} height={28} />
    <Skeleton variant="text" width={48} />
  </Box>
);

/**
 * Renders gamification state.
 * compact → Navbar chips; full → Dashboard widget.
 *
 * @param props - Component props.
 * @returns Gamification summary element.
 */
export const GamificationSummary: React.FC<
  GamificationSummaryProps
> = ({ compact = false }) => {
  const t = useTranslations('gamification');
  const { progress, isLoading } = useGamification();
  const testId = 'gamification-summary';

  if (isLoading && compact) {
    return <CompactSkeleton />;
  }
  if (isLoading) {
    return (
      <Box data-testid={testId} aria-busy="true">
        <Skeleton variant="text"
          width="100%" height={20} />
        <Skeleton variant="rectangular"
          width="100%" height={8}
          style={{ margin: '4px 0' }} />
        <Skeleton variant="text" width={80} />
      </Box>
    );
  }

  if (!progress) return null;

  if (compact) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center',
          gap: 1 }}
        data-testid={testId}
        aria-label={
          `${t('level')} ${progress.level}, `
          + `${t('streak')} ${progress.currentStreak}`
        }
        component="span"
      >
        <LevelBadge
          level={progress.level}
          title={progress.levelTitle}
          size="sm"
        />
        <StreakCounter
          streak={progress.currentStreak}
          size="sm"
        />
      </Box>
    );
  }

  return (
    <Box
      data-testid={testId}
      aria-label={t('level')}
      sx={{ width: '100%' }}
    >
      <GamificationSummaryFull progress={progress} />
    </Box>
  );
};

export default GamificationSummary;
