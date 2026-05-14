'use client';

/**
 * Inline error card for AI generation failures.
 * @module components/atoms/AiErrorCard
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';

/** Props for AiErrorCard. */
export interface AiErrorCardProps {
  /** Error message to display. */
  message: string;
}

/**
 * Renders a bordered error box with role="alert".
 */
export const AiErrorCard: React.FC<AiErrorCardProps> = (
  { message },
) => (
  <Box
    role="alert"
    sx={{
      border: '1px solid',
      borderColor: 'error.main',
      borderRadius: 2,
      p: 2,
      color: 'error.main',
      mb: 1,
    }}
  >
    <Typography variant="body2">{message}</Typography>
  </Box>
);

export default AiErrorCard;
