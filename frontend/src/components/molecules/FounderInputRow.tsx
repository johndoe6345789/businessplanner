'use client';

/**
 * Founder input row — name, role, idea flag,
 * and a remove button. Right-side inputs are in
 * FounderInputRowRight.
 * @module components/molecules/FounderInputRow
 */
import React from 'react';
import Box from '@shared/m3/Box';
import { TextField } from '@/components/atoms';
import {
  Select, Switch, FormControlLabel, MenuItem,
} from '@shared/m3';
import Button from '@shared/m3/Button';
import { FounderInputRowRight }
  from './FounderInputRowRight';
import type { FounderInput } from '@/types/legal';

/** Props for FounderInputRow. */
export interface FounderInputRowProps {
  /** Current founder data. */
  founder: FounderInput;
  /** Row index (0-based). */
  index: number;
  /** Called when any field changes. */
  onChange: (f: FounderInput) => void;
  /** Called when the row is removed. */
  onRemove: () => void;
  /** Translated remove button label. */
  removeLabel: string;
}

const ROLES = [
  'ceo', 'cto', 'cmo', 'coo', 'other',
] as const;

/**
 * Single founder row with left-side inputs.
 *
 * @param props - Row props.
 * @returns Founder row element.
 */
export const FounderInputRow: React.FC<
  FounderInputRowProps
> = ({ founder, index, onChange,
  onRemove, removeLabel }) => {
  const tid = `founder-row-${index}`;
  return (
    <Box data-testid={tid}
      sx={{ display: 'flex', flexWrap: 'wrap',
        gap: 1.5, alignItems: 'center', mb: 2,
        p: 1.5, borderRadius: 2,
        bgcolor: 'background.paper' }}>
      <Box sx={{ minWidth: 130 }}>
        <TextField label="Name"
          value={founder.name}
          onChange={(e) => onChange(
            { ...founder, name: e.target.value })}
          testId={`${tid}-name`} size="small" />
      </Box>
      <Select label="Role" size="small"
        value={founder.role}
        onChange={(e) => onChange({ ...founder,
          role: e.target.value as
            FounderInput['role'] })}
        testId={`${tid}-role`}>
        {ROLES.map((r) => (
          <MenuItem key={r} value={r}>
            {r.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
      <FormControlLabel label="Idea originator"
        control={
          <Switch checked={founder.ideaOriginator}
            onChange={(e) => onChange({
              ...founder,
              ideaOriginator: e.target.checked })}
            inputProps={{
              'aria-label': 'Idea originator',
              'data-testid': `${tid}-idea` }}
          />
        }
      />
      <FounderInputRowRight founder={founder}
        index={index} onChange={onChange} />
      <Button size="small" color="error"
        onClick={onRemove}
        aria-label={removeLabel}
        data-testid={`${tid}-remove`}>
        {removeLabel}
      </Button>
    </Box>
  );
};

export default FounderInputRow;
