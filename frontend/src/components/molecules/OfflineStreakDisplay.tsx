'use client';

/**
 * @file OfflineStreakDisplay.tsx
 * @brief Shows cached streak count from localStorage
 *        when the app is offline.
 */
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';

const STREAK_KEY = 'launchpad_cached_streak';

/**
 * Reads the last-known streak from localStorage and
 * renders it for offline display.
 *
 * @returns Streak display or empty fragment.
 */
const OfflineStreakDisplay: React.FC = () => {
  const t = useTranslations('offline');
  const [streak, setStreak] = useState<number | null>(
    null,
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      if (raw !== null) setStreak(parseInt(raw, 10));
    } catch { /* storage unavailable */ }
  }, []);

  if (streak === null) return null;

  return (
    <Box
      data-testid="offline-streak-display"
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 3,
        boxShadow: 1,
        display: 'inline-block',
        minWidth: 160,
      }}
    >
      <Typography variant="h3" fontWeight={700}>
        {streak}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('streakLabel')}
      </Typography>
    </Box>
  );
};

export default OfflineStreakDisplay;
