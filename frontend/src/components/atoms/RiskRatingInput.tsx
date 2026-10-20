'use client';

import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { RiskRating } from '@/types/riskAssessment';

const RATINGS: RiskRating[] = [1, 2, 3, 4, 5];

/** Props for RiskRatingInput. */
export interface RiskRatingInputProps {
  /** Short label shown above the select (e.g. "P"). */
  readonly label: string;
  /** Current rating value. */
  readonly value: RiskRating;
  /** Called when the user picks a new rating. */
  readonly onChange: (v: RiskRating) => void;
}

/**
 * Compact 1–5 rating select for probability / impact.
 *
 * @param props - RiskRatingInputProps.
 * @returns Select with 1–5 options.
 */
const RiskRatingInput: React.FC<
  RiskRatingInputProps
> = ({ label, value, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      label={label}
      aria-label={label}
      data-testid={`risk-rating-${label.toLowerCase()}`}
      onChange={(e) =>
        onChange(Number(e.target.value) as RiskRating)
      }
    >
      {RATINGS.map((r) => (
        <MenuItem key={r} value={r}>{r}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default RiskRatingInput;
