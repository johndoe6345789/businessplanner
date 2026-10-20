'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import gamificationConstants
  from '@/constants/gamification.json';

/** Size variant for the StreakCounter. */
type StreakSize = 'sm' | 'md' | 'lg';

/** Props for the StreakCounter atom. */
export interface StreakCounterProps {
  /** Number of consecutive days in the streak. */
  streak: number;
  /**
   * Visual size: sm for Navbar, md for Dashboard,
   * lg for Profile page.
   */
  size?: StreakSize;
}

const MILESTONES: number[] =
  gamificationConstants.streakMilestones;

/** Returns true when streak is a milestone value. */
function isMilestone(streak: number): boolean {
  return MILESTONES.includes(streak);
}

const SIZE_MAP: Record<StreakSize, {
  font: string;
  px: number;
}> = {
  sm: { font: 'caption', px: 14 },
  md: { font: 'body1', px: 20 },
  lg: { font: 'h6', px: 28 },
};

/**
 * Displays the user's consecutive-day streak with a
 * flame icon. Milestone streaks get a golden glow.
 * Zero streak renders a grey outline flame.
 *
 * @param props - Component props.
 * @returns Streak counter element.
 */
export const StreakCounter: React.FC<
  StreakCounterProps
> = ({ streak, size = 'md' }) => {
  const isActive = streak > 0;
  const milestone = isActive && isMilestone(streak);
  const { font, px } = SIZE_MAP[size];

  const boxSx = milestone
    ? {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        filter:
          'drop-shadow(0 0 6px #FFD700)',
      }
    : {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        opacity: isActive ? 1 : 0.4,
      };

  return (
    <Box
      sx={boxSx}
      data-testid="streak-counter"
      aria-label={`Current streak: ${streak} days`}
      role="status"
      component="span"
    >
      <span
        aria-hidden="true"
        style={{ fontSize: px, lineHeight: 1 }}
      >
        {isActive ? '🔥' : '🔥'}
      </span>
      <Typography
        variant={font as Parameters<
          typeof Typography
        >[0]['variant']}
        component="span"
      >
        {streak}
      </Typography>
    </Box>
  );
};

export default StreakCounter;
