'use client';

/**
 * Slider + capital contribution inputs for a
 * founder row. Extracted from FounderInputRowRight
 * to keep both files under 100 lines.
 * @module components/molecules/FounderSliderInputs
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { Slider } from '@shared/m3';
import { TextField } from '@/components/atoms';
import { useTranslations } from 'next-intl';
import type { FounderInput } from '@/types/legal';

/** Props for FounderSliderInputs. */
export interface FounderSliderInputsProps {
  /** Current founder data. */
  founder: FounderInput;
  /** Row index (0-based) for test IDs. */
  index: number;
  /** Called when any field changes. */
  onChange: (f: FounderInput) => void;
}

/**
 * Time-commitment slider and capital text input
 * for a founder row.
 *
 * @param props - Component props.
 * @returns Slider and capital inputs.
 */
export const FounderSliderInputs: React.FC<
  FounderSliderInputsProps
> = ({ founder, index, onChange }) => {
  const t = useTranslations('legal');
  const tid = `founder-row-${index}`;

  return (
    <>
      <Box sx={{ minWidth: 180 }}>
        <Typography
          variant="caption"
          component="label"
          htmlFor={`${tid}-time`}
        >
          {t('timeCommitment')}:{' '}
          {founder.timeCommitmentMonths}m
        </Typography>
        <Slider
          id={`${tid}-time`}
          min={0} max={48} step={1}
          value={founder.timeCommitmentMonths}
          onChange={(_, v) => onChange({
            ...founder,
            timeCommitmentMonths: v as number,
          })}
          aria-label={t('timeCommitment')}
          data-testid={`${tid}-time`}
          size="small"
        />
      </Box>
      <Box sx={{ minWidth: 130 }}>
        <TextField
          label={t('capitalLabel')}
          value={String(founder.capitalContribution)}
          type="number"
          onChange={(e) => onChange({
            ...founder,
            capitalContribution:
              Math.max(0, Number(e.target.value)),
          })}
          testId={`${tid}-capital`}
          size="small"
        />
      </Box>
    </>
  );
};

export default FounderSliderInputs;
