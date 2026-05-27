'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Skeleton from '@shared/m3/Skeleton';

/** Compact skeleton for Navbar gamification loading state. */
export const GamificationCompactSkeleton: React.FC = () => (
  <Box
    sx={{ display: 'flex', gap: 1 }}
    component="span"
    data-testid="gamification-summary"
  >
    <Skeleton variant="circular" width={28} height={28} />
    <Skeleton variant="text" width={48} />
  </Box>
);

export default GamificationCompactSkeleton;
