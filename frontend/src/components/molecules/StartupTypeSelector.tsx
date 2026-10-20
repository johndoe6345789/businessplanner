'use client';

import React from 'react';
import Grid from '@shared/m3/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import Icon from '@mui/material/Icon';
import CircularProgress from '@mui/material/CircularProgress';
import { useListStartupTypesQuery }
  from '@/store/api/startupTypeApi';

/** Props for StartupTypeSelector. */
export interface StartupTypeSelectorProps {
  /** Currently selected startup type slug. */
  selectedSlug: string | null;
  /** Called when the user picks a type. */
  onSelect: (slug: string) => void;
}

/**
 * Responsive grid of startup-type cards.
 * Fetches types from the API and highlights the selection.
 *
 * @param props - Selected slug and selection callback.
 * @returns Grid of selectable startup type cards.
 */
export const StartupTypeSelector: React.FC<
  StartupTypeSelectorProps
> = ({ selectedSlug, onSelect }) => {
  const { data, isLoading } = useListStartupTypesQuery();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}
        data-testid="startup-type-selector-loading">
        <CircularProgress aria-label="Loading types" />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}
      data-testid="startup-type-selector">
      {(data ?? []).map((type) => {
        const sel = type.slug === selectedSlug;
        return (
          <Grid key={type.slug} item xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%',
              borderWidth: sel ? 2 : 1,
              borderColor: sel ? 'primary.main' : 'divider',
            }}>
              <CardActionArea
                onClick={() => onSelect(type.slug)}
                data-testid={
                  `startup-type-card-${type.slug}`}
                aria-pressed={sel}
                aria-label={type.name}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ textAlign: 'center',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 1 }}>
                  <Icon sx={{ fontSize: 48 }}
                    aria-hidden="true">
                    {type.icon}
                  </Icon>
                  <Typography variant="subtitle1">
                    {type.name}
                  </Typography>
                  <Typography variant="body2"
                    color="text.secondary"
                    sx={{ display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden' }}>
                    {type.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StartupTypeSelector;
