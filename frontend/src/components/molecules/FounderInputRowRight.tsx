'use client';

/**
 * Right half of the founder input row: time slider,
 * capital input, and experience select.
 * @module components/molecules/FounderInputRowRight
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { TextField } from '@/components/atoms';
import { Select, Slider, MenuItem } from '@shared/m3';
import type { FounderInput } from '@/types/legal';

/** Props for FounderInputRowRight. */
export interface FounderInputRowRightProps {
  /** Current founder data. */
  founder: FounderInput;
  /** Row index (0-based) for test IDs. */
  index: number;
  /** Called when any field changes. */
  onChange: (f: FounderInput) => void;
}

const EXP_OPTS = [
  'high', 'medium', 'low',
] as const;

/**
 * Right-side founder fields: time, capital, experience.
 * Split from FounderInputRow to stay under 100 lines.
 *
 * @param props - Component props.
 * @returns Right-side founder inputs.
 */
export const FounderInputRowRight: React.FC<
  FounderInputRowRightProps
> = ({ founder, index, onChange }) => {
  const tid = `founder-row-${index}`;

  return (
    <>
      <Box sx={{ minWidth: 180 }}>
        <Typography
          variant="caption"
          component="label"
          htmlFor={`${tid}-time`}
        >
          Time commitment: {founder.timeCommitmentMonths}m
        </Typography>
        <Slider
          id={`${tid}-time`}
          min={0} max={48} step={1}
          value={founder.timeCommitmentMonths}
          onChange={(_, v) => onChange({
            ...founder,
            timeCommitmentMonths: v as number,
          })}
          aria-label="Time commitment in months"
          data-testid={`${tid}-time`}
          size="small"
          sx={{ display: 'block' }}
        />
      </Box>
      <Box sx={{ minWidth: 130 }}>
        <TextField
          label="Capital ($)"
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
      <Select
        label="Experience"
        size="small"
        value={founder.priorExperience}
        onChange={(e) => onChange({
          ...founder,
          priorExperience: e.target
            .value as FounderInput['priorExperience'],
        })}
        testId={`${tid}-exp`}
      >
        {EXP_OPTS.map((o) => (
          <MenuItem key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default FounderInputRowRight;
