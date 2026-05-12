'use client';

// D3 opt-in: PATCH /api/users/me/leaderboard-opt-in
// not yet implemented — placeholder UI only.
import React, { useState } from 'react';
import Table from '@shared/m3/Table';
import { TableHead, TableBody, TableRow,
  TableCell, TableContainer,
} from '@shared/m3/Table';
import Box from '@shared/m3/Box';
import Chip from '@shared/m3/Chip';
import Skeleton from '@shared/m3/Skeleton';
import { useTranslations } from 'next-intl';
import {
  useGetLeaderboardQuery,
} from '@/store/api/gamificationApi';
import { useAppSelector } from '@/store/hooks';
import type { LeaderboardPeriod }
  from '@/types/gamification';
import {
  LeaderboardRow,
} from '../molecules/LeaderboardRow';

const PERIODS: LeaderboardPeriod[] =
  ['all', 'weekly', 'monthly'];

/** Props for the LeaderboardTable organism. */
export interface LeaderboardTableProps {
  /** Default time-period filter. */
  period?: LeaderboardPeriod;
}

/**
 * Ranked leaderboard with period filter tabs.
 * Highlights the current user's row.
 *
 * @param props - Component props.
 * @returns Leaderboard table.
 */
export const LeaderboardTable: React.FC<
  LeaderboardTableProps
> = ({ period: init = 'all' }) => {
  const t = useTranslations('gamification');
  const [period, setPeriod] =
    useState<LeaderboardPeriod>(init);
  const userId =
    useAppSelector((s) => s.auth.user?.id);
  const { data, isLoading } =
    useGetLeaderboardQuery({ period, limit: 50 });
  const labels: Record<LeaderboardPeriod, string> = {
    all: t('allTime'), weekly: t('thisWeek'),
    monthly: t('thisMonth'),
  };

  return (
    <Box
      data-testid="leaderboard-table"
      aria-label={t('leaderboard')}
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {PERIODS.map((p) => (
          <Chip key={p} label={labels[p]} clickable
            onClick={() => setPeriod(p)}
            variant={period === p
              ? 'filled' : 'outlined'}
            aria-pressed={period === p}
          />
        ))}
      </Box>
      {isLoading
        ? <Skeleton variant="rectangular"
            width="100%" height={240} />
        : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('rankCol')}</TableCell>
                <TableCell>{t('player')}</TableCell>
                <TableCell>{t('level')}</TableCell>
                <TableCell>{t('xp')}</TableCell>
                <TableCell>{t('streak')}</TableCell>
                <TableCell>{t('badges')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data ?? []).map((e) => (
                <LeaderboardRow key={e.id}
                  entry={e}
                  isCurrentUser={e.id === userId}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
export default LeaderboardTable;
