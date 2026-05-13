'use client';

/**
 * Card for a single acquisition channel.
 * @module components/molecules/ChannelCard
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useTranslations } from 'next-intl';

/** A channel entry from channel-fit.json. */
export interface ChannelEntry {
  id: string;
  name: string;
  cac_range: string;
  timeToROI: string;
  bestFor: string[];
}

/** Props for ChannelCard. */
export interface ChannelCardProps {
  /** Channel data to display. */
  channel: ChannelEntry;
  /** Whether this channel is highlighted for the
   *  current startup type. */
  highlighted: boolean;
}

/**
 * Card showing channel details and type chips.
 *
 * @param props - Channel data and highlight flag.
 * @returns ChannelCard UI.
 */
export const ChannelCard: React.FC<
  ChannelCardProps
> = ({ channel: c, highlighted }) => {
  const t = useTranslations('channels');

  return (
    <Paper
      data-testid="channel-card"
      aria-label={c.name}
      elevation={highlighted ? 4 : 1}
      sx={{
        p: 2,
        border: 2,
        borderColor: highlighted
          ? 'primary.main'
          : 'transparent',
        borderRadius: 2,
      }}>
      <Typography variant="subtitle1"
        fontWeight={700} gutterBottom>
        {c.name}
      </Typography>
      <Typography variant="body2"
        color="text.secondary">
        {t('cac')}: {c.cac_range}
      </Typography>
      <Typography variant="body2"
        color="text.secondary" sx={{ mb: 1 }}>
        {t('timeToROI')}: {c.timeToROI}
      </Typography>
      <Box sx={{ display: 'flex',
        gap: 0.5, flexWrap: 'wrap' }}>
        {c.bestFor.map((slug) => (
          <Chip key={slug} label={slug}
            size="small"
            color={highlighted
              ? 'primary' : 'default'}
            variant="outlined" />
        ))}
      </Box>
    </Paper>
  );
};

export default ChannelCard;
