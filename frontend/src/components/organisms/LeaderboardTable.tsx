'use client';

import React from 'react';
import Table from '@shared/m3/Table';
import { TableHead, TableBody, TableRow,
  TableCell, TableContainer,
} from '@shared/m3/Table';
import Box from '@shared/m3/Box';
import Chip from '@shared/m3/Chip';
import Skeleton from '@shared/m3/Skeleton';
import { LeaderboardRow }
  from '../molecules/LeaderboardRow';
import { useLeaderboardTable }
  from '@/hooks/useLeaderboardTable';
import type { LeaderboardPeriod }
  from '@/types/gamification';

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
  const vm = useLeaderboardTable(init);

  return (
    <Box
      data-testid="leaderboard-table"
      aria-label={vm.t('leaderboard')}
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {PERIODS.map((p) => (
          <Chip key={p} label={vm.labels[p]} clickable
            onClick={() => vm.setPeriod(p)}
            variant={vm.period === p ? 'filled' : 'outlined'}
            aria-pressed={vm.period === p}
          />
        ))}
      </Box>
      {vm.isLoading
        ? <Skeleton variant="rectangular"
            width="100%" height={240} />
        : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['rankCol','player','level','xp',
                  'streak','badges'].map((k) => (
                  <TableCell key={k}>{vm.t(k)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {vm.rows.length === 0 && (
                <TableRow><TableCell colSpan={6}
                  style={{ textAlign: 'center',
                    color: '#9e9e9e',
                    paddingTop: 32, paddingBottom: 32 }}>
                  {vm.t('noEntriesYet')}
                </TableCell></TableRow>
              )}
              {vm.rows.map((e) => (
                <LeaderboardRow key={e.id} entry={e}
                  isCurrentUser={e.id === vm.userId} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
export default LeaderboardTable;
