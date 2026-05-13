'use client';

/**
 * Channel-fit guide organism.
 * @module components/organisms/ChannelFitGuide
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { useTranslations } from 'next-intl';
import { useAppSelector }
  from '@/store/hooks';
import { ChannelCard } from
  '@/components/molecules/ChannelCard';
import channelData
  from '@/constants/channel-fit.json';

const ALL = 'all';

/**
 * Grid of channel cards filtered by type and CAC.
 * Highlights channels that match the active startup type.
 *
 * @returns ChannelFitGuide UI.
 */
export const ChannelFitGuide: React.FC = () => {
  const t = useTranslations('channels');
  const selectedSlug = useAppSelector(
    (s) => s.startupType.selectedSlug,
  );
  const [typeFilter, setTypeFilter] =
    useState<string>(ALL);

  const types = Array.from(
    new Set(
      channelData.channels.flatMap(
        (c) => c.bestFor,
      ),
    ),
  ).sort();

  const channels = typeFilter === ALL
    ? channelData.channels
    : channelData.channels.filter(
        (c) => c.bestFor.includes(typeFilter),
      );

  return (
    <Box data-testid="channel-fit-guide"
      aria-label={t('title')}>
      <Box sx={{ mb: 3, maxWidth: 280 }}>
        <TextField
          label={t('allTypes')}
          select fullWidth size="small"
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)}
          inputProps={{
            'data-testid': 'channel-type-filter',
          }}>
          <MenuItem value={ALL}>
            {t('allTypes')}
          </MenuItem>
          {types.map((tp) => (
            <MenuItem key={tp} value={tp}>
              {tp}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {channels.length === 0 && (
        <Typography color="text.secondary"
          data-testid="channel-empty">
          {t('noChannels')}
        </Typography>
      )}
      <Grid container spacing={2}>
        {channels.map((c) => (
          <Grid key={c.id}
            xs={12} sm={6} md={4} item>
            <ChannelCard channel={c}
              highlighted={
                !!selectedSlug &&
                c.bestFor.includes(selectedSlug)
              } />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChannelFitGuide;
