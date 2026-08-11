'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import LinearProgress
  from '@shared/m3/LinearProgress';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';

/** Props for the XPBar atom. */
export interface XPBarProps {
  /** Current accumulated points. */
  points: number;
  /** Points threshold for the next level. */
  nextLevelAt: number;
  /** Current level number. */
  level: number;
  /** Human-readable level title. */
  levelTitle: string;
  /** When true, shows "Level N — Title" above bar. */
  showLabel?: boolean;
}

/**
 * Horizontal XP progress bar showing current level
 * and points towards the next level.
 *
 * @param props - Component props.
 * @returns XP bar element.
 */
export const XPBar: React.FC<XPBarProps> = ({
  points,
  nextLevelAt,
  level,
  levelTitle,
  showLabel = false,
}) => {
  const t = useTranslations('gamification');
  const raw = nextLevelAt > 0
    ? (points / nextLevelAt) * 100
    : 100;
  const pct = Math.min(100, Math.max(0, raw));

  return (
    <Box
      data-testid="xp-bar"
      aria-label={
        `${t('level')} ${level}: `
        + `${points} / ${nextLevelAt} XP`
      }
      sx={{ width: '100%' }}
    >
      {showLabel && (
        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          sx={{ mb: 0.5 }}
        >
          {`${t('level')} ${level} — ${levelTitle}`}
        </Typography>
      )}
      <LinearProgress
        variant="determinate"
        value={pct}
        color="primary"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        testId="xp-bar-progress"
      />
      <Typography
        variant="caption"
        color="text.secondary"
        component="div"
        sx={{ mt: 0.5 }}
      >
        {`${points} / ${nextLevelAt} XP`}
      </Typography>
    </Box>
  );
};

export default XPBar;
