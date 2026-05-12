'use client';

/**
 * Live vesting schedule calculator organism.
 * @module components/organisms/VestingCalculator
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { VestingControls }
  from '@/components/molecules/VestingControls';
import { VestingScheduleTable }
  from '@/components/molecules/VestingScheduleTable';
import { useVestingCompute }
  from '@/hooks/useVestingCompute';

/** Summary card for a single metric. */
const SummaryCard: React.FC<{
  label: string; value: string; testId: string;
}> = ({ label, value, testId }) => (
  <Box>
    <Typography variant="caption"
      color="text.secondary">{label}</Typography>
    <Typography variant="h6"
      data-testid={testId}>{value}</Typography>
  </Box>
);

/**
 * Vesting schedule calculator with live results.
 *
 * @returns Vesting calculator UI.
 */
export const VestingCalculator: React.FC = () => {
  const t = useTranslations('legal');
  const [totalShares, setShares] = useState(1_000_000);
  const [cliffMonths, setCliff] = useState(12);
  const [vestingMonths, setVesting] = useState(48);
  const [accel, setAccel] = useState(false);

  const { cliffShares, monthlyVest, schedule } =
    useVestingCompute({
      totalShares, cliffMonths, vestingMonths,
    });

  return (
    <Box data-testid="vesting-calculator"
      aria-label={t('vestingTitle')}>
      <VestingControls
        totalShares={totalShares}
        cliffMonths={cliffMonths}
        vestingMonths={vestingMonths}
        accelerationOnChange={accel}
        onShares={setShares}
        onCliff={setCliff}
        onVesting={setVesting}
        onAcceleration={setAccel}
      />
      <Box sx={{ display: 'flex', gap: 4, mb: 3,
        flexWrap: 'wrap' }}>
        <SummaryCard label={t('cliffShares')}
          value={cliffShares.toLocaleString()}
          testId="vesting-cliff-val" />
        <SummaryCard label={t('monthlyVest')}
          value={monthlyVest.toLocaleString()}
          testId="vesting-monthly-val" />
        <SummaryCard label="Total months"
          value={String(vestingMonths)}
          testId="vesting-total-months" />
      </Box>
      {accel && (
        <Typography variant="body2"
          color="text.secondary" sx={{ mb: 2 }}
          data-testid="vesting-accel-note">
          Double-trigger acceleration applies on
          change of control.
        </Typography>
      )}
      <VestingScheduleTable schedule={schedule} />
    </Box>
  );
};

export default VestingCalculator;
