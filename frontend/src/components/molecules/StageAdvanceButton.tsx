'use client';

import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector }
  from '@/store/hooks';
import {
  setOnboardingData,
} from '@/store/slices/startupTypeSlice';
import type { StartupTypeStage }
  from '@/types/startupType';

/** Props for StageAdvanceButton. */
export interface StageAdvanceButtonProps {
  /** Ordered list of all stages for this startup type. */
  stages: StartupTypeStage[];
  /** Slug of the stage the user is currently on. */
  currentStage: string | null;
}

/**
 * Shows the current stage label and, unless the user is
 * on the last stage, a button to advance to the next one.
 *
 * @param props - Stages array and current stage slug.
 * @returns Current-stage text and advance/final message.
 */
export const StageAdvanceButton: React.FC<
  StageAdvanceButtonProps
> = ({ stages, currentStage }) => {
  const t = useTranslations('planner');
  const dispatch = useAppDispatch();
  const {
    startupName, coFounderStatus, biggestChallenge,
  } = useAppSelector((s) => s.startupType);

  const currentIdx = stages.findIndex(
    (s) => s.slug === currentStage,
  );
  const current = currentIdx >= 0
    ? stages[currentIdx]
    : null;
  const next = currentIdx >= 0 && currentIdx < stages.length - 1
    ? stages[currentIdx + 1]
    : null;
  const isLast = currentIdx === stages.length - 1
    && stages.length > 0;

  const handleAdvance = () => {
    if (!next) return;
    dispatch(setOnboardingData({
      startupName,
      selectedStage: next.slug,
      coFounderStatus,
      biggestChallenge,
    }));
  };

  return (
    <>
      {current && (
        <Typography
          variant="body2"
          sx={{ mt: 1 }}
          data-testid="stage-gate-current-label"
        >
          {t('currentStage')}: <strong>{current.name}</strong>
        </Typography>
      )}
      {isLast ? (
        <Typography
          variant="body2"
          color="success.main"
          sx={{ mt: 0.5 }}
          data-testid="stage-gate-final-message"
        >
          {t('finalStage')}
        </Typography>
      ) : (
        next && (
          <Button
            variant="contained"
            size="small"
            onClick={handleAdvance}
            sx={{ mt: 1 }}
            data-testid="stage-gate-advance-btn"
            aria-label={t('advanceStage')}
          >
            {t('advanceStage')}
          </Button>
        )
      )}
    </>
  );
};

export default StageAdvanceButton;
