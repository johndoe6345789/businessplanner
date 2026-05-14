'use client';

/**
 * Input controls for the vesting calculator.
 * @module components/molecules/VestingControls
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { Slider, Switch, FormControlLabel }
  from '@shared/m3';
import { TextField } from '@/components/atoms';
import { useTranslations } from 'next-intl';

/** Props for VestingControls. */
export interface VestingControlsProps {
  /** Total share count. */
  totalShares: number;
  /** Cliff period in months. */
  cliffMonths: number;
  /** Total vesting duration in months. */
  vestingMonths: number;
  /** Double-trigger acceleration flag. */
  accelerationOnChange: boolean;
  /** Called when totalShares changes. */
  onShares: (v: number) => void;
  /** Called when cliffMonths changes. */
  onCliff: (v: number) => void;
  /** Called when vestingMonths changes. */
  onVesting: (v: number) => void;
  /** Called when acceleration toggle changes. */
  onAcceleration: (v: boolean) => void;
}

/**
 * Control panel for vesting schedule inputs.
 *
 * @param props - Control props.
 * @returns Vesting input controls.
 */
export const VestingControls: React.FC<
  VestingControlsProps
> = ({ totalShares, cliffMonths, vestingMonths,
  accelerationOnChange, onShares, onCliff,
  onVesting, onAcceleration }) => {
  const t = useTranslations('legal');
  return (
    <Box sx={{ display: 'flex',
      flexDirection: 'column', gap: 2, mb: 3 }}>
      <Box sx={{ maxWidth: 280 }}>
        <TextField label={t('totalShares')}
          value={String(totalShares)} type="number"
          onChange={(e) => onShares(
            Math.max(1, Number(e.target.value)))}
          testId="vesting-shares" size="small" />
      </Box>
      <Box sx={{ maxWidth: 320 }}>
        <Typography variant="caption"
          component="label" htmlFor="cliff-slider">
          {t('cliffShares')}: {cliffMonths}m
        </Typography>
        <Slider id="cliff-slider" min={0} max={24}
          step={1} value={cliffMonths}
          onChange={(_, v) => onCliff(v as number)}
          aria-label={t('cliffShares')}
          data-testid="vesting-cliff-slider"
          size="small" sx={{ display: 'block' }} />
      </Box>
      <Box sx={{ maxWidth: 320 }}>
        <Typography variant="caption"
          component="label" htmlFor="vest-slider">
          {t('totalVesting')}: {vestingMonths}m
        </Typography>
        <Slider id="vest-slider" min={12} max={60}
          step={1} value={vestingMonths}
          onChange={(_, v) =>
            onVesting(v as number)}
          aria-label={t('totalVesting')}
          data-testid="vesting-months-slider"
          size="small" sx={{ display: 'block' }} />
      </Box>
      <FormControlLabel
        label={t('doubleTrigger')}
        control={
          <Switch checked={accelerationOnChange}
            onChange={(e) =>
              onAcceleration(e.target.checked)}
            inputProps={{
              'aria-label': t('doubleTrigger'),
              'data-testid': 'vesting-accel' }} />
        }
      />
    </Box>
  );
};

export default VestingControls;
