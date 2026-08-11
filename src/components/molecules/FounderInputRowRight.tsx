'use client';

/**
 * Right half of the founder input row: time slider,
 * capital input, and experience select.
 * @module components/molecules/FounderInputRowRight
 */
import React from 'react';
import { Select, MenuItem } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { FounderSliderInputs }
  from './FounderSliderInputs';
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
 * Right-side founder fields: time, capital,
 * experience. Uses FounderSliderInputs for slider
 * and capital sections.
 *
 * @param props - Component props.
 * @returns Right-side founder inputs.
 */
export const FounderInputRowRight: React.FC<
  FounderInputRowRightProps
> = ({ founder, index, onChange }) => {
  const t = useTranslations('legal');
  const tid = `founder-row-${index}`;

  return (
    <>
      <FounderSliderInputs
        founder={founder}
        index={index}
        onChange={onChange}
      />
      <Select
        label={t('experienceLabel')}
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
            {t(`exp_${o}`)}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default FounderInputRowRight;
