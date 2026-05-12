'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepButton from '@mui/material/StepButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress
  from '@mui/material/CircularProgress';
import { useGetStartupTypeQuery }
  from '@/store/api/startupTypeApi';
import { StageAdvanceButton }
  from './StageAdvanceButton';

/** Props for StageGateBar. */
export interface StageGateBarProps {
  /** Slug of the user's selected startup type. */
  typeSlug: string;
  /** Slug of the user's current lifecycle stage. */
  currentStage: string | null;
}

/**
 * Horizontal stepper showing per-type lifecycle stages.
 * Active stage is highlighted; completed stages are marked
 * done. Clicking a step reveals its description tooltip.
 *
 * @param props - typeSlug and currentStage slug.
 * @returns Stage gate stepper with advance button.
 */
export const StageGateBar: React.FC<
  StageGateBarProps
> = ({ typeSlug, currentStage }) => {
  const { data, isLoading } =
    useGetStartupTypeQuery(typeSlug);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={2}
        data-testid="stage-gate-bar-loading">
        <CircularProgress size={24}
          aria-label="Loading stages" />
      </Box>
    );
  }

  const stages = data?.stages ?? [];
  const currentIdx = stages.findIndex(
    (s) => s.slug === currentStage,
  );
  const activeStep = currentIdx >= 0 ? currentIdx : 0;

  return (
    <Box sx={{ mb: 3 }} data-testid="stage-gate-bar"
      aria-label="Startup lifecycle stages">
      <Stepper nonLinear activeStep={activeStep}
        alternativeLabel sx={{ overflowX: 'auto' }}>
        {stages.map((stage, idx) => (
          <Step key={stage.slug}
            completed={idx < activeStep}>
            <Tooltip title={stage.description}
              arrow placement="top">
              <StepButton
                data-testid={`stage-step-${stage.slug}`}
                aria-label={stage.name}
                disableRipple>
                <StepLabel>{stage.name}</StepLabel>
              </StepButton>
            </Tooltip>
          </Step>
        ))}
      </Stepper>
      <StageAdvanceButton
        stages={stages}
        currentStage={currentStage}
      />
    </Box>
  );
};

export default StageGateBar;
