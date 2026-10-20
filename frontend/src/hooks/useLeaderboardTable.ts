import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useGetLeaderboardQuery,
} from '@/store/api/gamificationApi';
import { useAppSelector } from '@/store/hooks';
import type { LeaderboardPeriod }
  from '@/types/gamification';

/**
 * State and data for the leaderboard table organism.
 *
 * @param init - Initial time-period filter.
 * @returns Leaderboard state and data.
 */
export function useLeaderboardTable(
  init: LeaderboardPeriod = 'all',
) {
  const t = useTranslations('gamification');
  const [period, setPeriod] =
    useState<LeaderboardPeriod>(init);
  const userId =
    useAppSelector((s) => s.auth.user?.id);
  const { data, isLoading } =
    useGetLeaderboardQuery({ period, limit: 50 });
  const labels: Record<LeaderboardPeriod, string> = {
    all: t('allTime'),
    weekly: t('thisWeek'),
    monthly: t('thisMonth'),
  };
  return {
    t, period, setPeriod, userId,
    isLoading, labels, rows: data ?? [],
  };
}
