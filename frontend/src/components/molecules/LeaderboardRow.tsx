'use client';

import React from 'react';
import { TableRow, TableCell }
  from '@shared/m3/Table';
import { Avatar } from '@/components/atoms';
import Typography from '@shared/m3/Typography';
import type { LeaderboardEntry }
  from '@/types/gamification';

/** Props for a single leaderboard table row. */
export interface LeaderboardRowProps {
  /** Leaderboard entry data. */
  entry: LeaderboardEntry;
  /** Whether this row belongs to the current user. */
  isCurrentUser: boolean;
}

/**
 * Single row in the leaderboard table.
 * Highlighted when isCurrentUser is true.
 *
 * @param props - Component props.
 * @returns Table row element.
 */
export const LeaderboardRow: React.FC<
  LeaderboardRowProps
> = ({ entry, isCurrentUser }) => (
  <TableRow
    data-testid={`leaderboard-row-${entry.id}`}
    aria-current={isCurrentUser ? 'true' : undefined}
    style={isCurrentUser ? {
      backgroundColor: 'rgba(0,0,0,0.08)',
      fontWeight: 700,
    } : undefined}
  >
    <TableCell>{entry.rank}</TableCell>
    <TableCell>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Avatar
          src={entry.avatarUrl}
          alt={entry.displayName}
          size="sm"
        />
        <Typography variant="body2">
          {entry.displayName}
        </Typography>
      </div>
    </TableCell>
    <TableCell>{entry.currentLevel}</TableCell>
    <TableCell>{entry.totalPoints}</TableCell>
    <TableCell>{entry.currentStreak}</TableCell>
    <TableCell>{entry.badgeCount}</TableCell>
  </TableRow>
);

export default LeaderboardRow;
