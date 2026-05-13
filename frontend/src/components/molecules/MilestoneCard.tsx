'use client';

/**
 * Branded shareable milestone card.
 * @module components/molecules/MilestoneCard
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Paper from '@mui/material/Paper';

/** Props for MilestoneCard. */
export interface MilestoneCardProps {
  /** Milestone template text. */
  text: string;
  /** Milestone emoji. */
  emoji: string;
  /** Founder display name. */
  founderName: string;
  /** Startup name. */
  startupName: string;
  /** Optional ref for html2canvas capture. */
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Branded 1200×630 shareable milestone card.
 * Dark gradient background, white text, LaunchPad logo.
 *
 * @param props - Card content and optional ref.
 * @returns MilestoneCard UI.
 */
export const MilestoneCard: React.FC<
  MilestoneCardProps
> = ({ text, emoji, founderName,
  startupName, cardRef }) => (
  <Paper
    ref={cardRef}
    data-testid="milestone-card"
    aria-label="Shareable milestone card"
    elevation={0}
    sx={{
      aspectRatio: '1200 / 630',
      width: '100%',
      background: 'linear-gradient(' +
        '135deg, #1a1a2e 0%, ' +
        '#16213e 50%, #0f3460 100%)',
      borderRadius: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4,
      color: '#ffffff',
      overflow: 'hidden',
    }}>
    <Typography
      variant="overline"
      sx={{ color: 'rgba(255,255,255,0.6)',
        letterSpacing: 4, mb: 2 }}>
      LaunchPad
    </Typography>
    <Box component="span"
      sx={{ fontSize: '4rem', lineHeight: 1,
        mb: 2 }}>
      {emoji}
    </Box>
    <Typography variant="h5"
      fontWeight={700} align="center"
      sx={{ color: '#ffffff', mb: 1,
        maxWidth: '80%' }}>
      {text}
    </Typography>
    {startupName && (
      <Typography variant="subtitle1"
        sx={{ color: 'rgba(255,255,255,0.8)',
          mb: 2 }}>
        {startupName}
      </Typography>
    )}
    <Typography variant="body2"
      sx={{ color: 'rgba(255,255,255,0.5)',
        mt: 'auto' }}>
      {founderName}
    </Typography>
  </Paper>
);

export default MilestoneCard;
