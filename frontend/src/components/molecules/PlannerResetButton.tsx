'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';

/** Props for PlannerResetButton. */
export interface PlannerResetButtonProps {
  /** Called when the user confirms a reset. */
  onReset: () => void;
}

/**
 * Reset-progress button with inline confirmation.
 * Avoids window.confirm for SSR compatibility.
 *
 * @param props - Component props.
 */
export const PlannerResetButton: React.FC<
  PlannerResetButtonProps
> = ({ onReset }) => {
  const t = useTranslations('planner');
  const tc = useTranslations('common');
  const [confirming, setConfirming] =
    useState(false);

  if (confirming) {
    return (
      <Box sx={{
        display: 'inline-flex',
        gap: 1, alignItems: 'center',
      }}>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {t('resetConfirm')}
        </Typography>
        <Typography
          component="button"
          variant="caption"
          color="error"
          onClick={() => {
            onReset();
            setConfirming(false);
          }}
          data-testid="reset-confirm-yes"
          sx={{
            background: 'none', border: 'none',
            cursor: 'pointer', p: 0,
            fontWeight: 600,
          }}
        >
          {t('reset')}
        </Typography>
        <Typography
          component="button"
          variant="caption"
          color="text.disabled"
          onClick={() => setConfirming(false)}
          data-testid="reset-confirm-cancel"
          sx={{
            background: 'none', border: 'none',
            cursor: 'pointer', p: 0,
          }}
        >
          {tc('cancel')}
        </Typography>
      </Box>
    );
  }

  return (
    <Typography
      component="button"
      variant="caption"
      color="text.disabled"
      onClick={() => setConfirming(true)}
      aria-label={t('reset')}
      data-testid="reset-progress"
      sx={{
        background: 'none', border: 'none',
        cursor: 'pointer', p: 0,
      }}
    >
      {t('reset')}
    </Typography>
  );
};

export default PlannerResetButton;
