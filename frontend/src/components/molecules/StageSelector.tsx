'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Radio from '@mui/material/Radio';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetStartupTypeQuery }
  from '@/store/api/startupTypeApi';

/** Props for StageSelector. */
export interface StageSelectorProps {
  /** Slug of the startup type whose stages to show. */
  typeSlug: string;
  /** Currently selected stage slug. */
  selectedStage: string | null;
  /** Called when the user picks a stage. */
  onSelect: (slug: string) => void;
}

/**
 * Vertical radio-card list of lifecycle stages for step 3
 * of the onboarding wizard.
 *
 * @param props - Type slug, selected stage, and callback.
 * @returns List of selectable stage cards.
 */
export const StageSelector: React.FC<
  StageSelectorProps
> = ({ typeSlug, selectedStage, onSelect }) => {
  const { data, isLoading } =
    useGetStartupTypeQuery(typeSlug);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}
        data-testid="stage-selector-loading">
        <CircularProgress aria-label="Loading stages" />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={1.5}
      data-testid="stage-selector"
      role="radiogroup" aria-label="Current stage">
      {(data?.stages ?? []).map((stage) => {
        const sel = stage.slug === selectedStage;
        return (
          <Card key={stage.slug} variant="outlined"
            sx={{ borderWidth: sel ? 2 : 1,
              borderColor: sel ? 'primary.main' : 'divider',
            }}>
            <CardActionArea
              onClick={() => onSelect(stage.slug)}
              data-testid={`stage-card-${stage.slug}`}
              aria-checked={sel}
              aria-label={stage.name}
              role="radio"
            >
              <CardContent sx={{ display: 'flex',
                alignItems: 'center', gap: 1 }}>
                <Radio checked={sel} tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-hidden': true }} />
                <Box>
                  <Typography variant="subtitle2">
                    {stage.name}
                  </Typography>
                  <Typography variant="body2"
                    color="text.secondary">
                    {stage.description}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
};

export default StageSelector;
