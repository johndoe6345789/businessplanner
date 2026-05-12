'use client';

import React from 'react';
import Tooltip from '@shared/m3/Tooltip';
import Chip from '@shared/m3/Chip';

/** Size variant for the LevelBadge. */
type BadgeSize = 'sm' | 'md';

/** Props for the LevelBadge atom. */
export interface LevelBadgeProps {
  /** Current level number (1-8). */
  level: number;
  /** Human-readable level title. */
  title: string;
  /** Visual size of the badge. */
  size?: BadgeSize;
}

/**
 * Returns the colour key for a given level tier.
 * Levels 1-2 grey, 3-4 info/blue, 5-6 purple,
 * 7-8 gold/warning.
 */
function tierColor(
  level: number,
): 'default' | 'info' | 'secondary' | 'warning' {
  if (level <= 2) return 'default';
  if (level <= 4) return 'info';
  if (level <= 6) return 'secondary';
  return 'warning';
}

/**
 * Circular chip showing the user's current level.
 * Colour shifts by tier. Tooltip reveals the title.
 *
 * @param props - Component props.
 * @returns Level badge element.
 */
export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  title,
  size = 'md',
}) => {
  const color = tierColor(level);
  const chipSize = size === 'sm' ? 'sm' : undefined;

  return (
    <Tooltip title={title} placement="bottom">
      <span
        data-testid="level-badge"
        aria-label={`Level ${level}: ${title}`}
      >
        <Chip
          label={String(level)}
          color={color}
          size={chipSize}
          sx={{
            borderRadius: '50%',
            minWidth: size === 'sm' ? 24 : 32,
            fontWeight: 700,
          }}
        />
      </span>
    </Tooltip>
  );
};

export default LevelBadge;
