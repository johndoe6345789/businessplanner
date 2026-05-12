'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import StarIcon from '@mui/icons-material/Star';

/**
 * Small "Priority" label with a star icon, shown above
 * the planner phase that matches the user's biggest
 * challenge.
 *
 * @returns Star + label row, or null when hidden is true.
 */
export const PriorityBadge: React.FC = () => (
  <Box
    sx={{ display: 'flex', alignItems: 'center',
      gap: 0.5, mb: 0.5 }}
    data-testid="priority-badge"
  >
    <StarIcon
      sx={{ color: 'warning.main', fontSize: 18 }}
      aria-hidden="true"
    />
    <Typography
      variant="caption"
      sx={{ color: 'warning.main', fontWeight: 600 }}
    >
      Priority
    </Typography>
  </Box>
);

export default PriorityBadge;
