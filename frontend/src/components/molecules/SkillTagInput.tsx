'use client';

/**
 * @file SkillTagInput.tsx
 * @brief Text input + chip list for entering skills.
 *        Press Enter or comma to confirm a tag.
 */
import React, { useState, useRef } from 'react';
import { SkillTag } from '../atoms/SkillTag';

/** Props for SkillTagInput. */
export interface SkillTagInputProps {
  /** Current list of skill strings. */
  skills: string[];
  /** Called when a new skill is confirmed. */
  onAdd: (skill: string) => void;
  /** Called when a chip's × is clicked. */
  onRemove: (skill: string) => void;
  /** Input placeholder text. */
  placeholder?: string;
  /** Accessible label for the input. */
  label?: string;
  /** data-testid for the input. */
  testId?: string;
}

const WRAP: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap' as const,
  gap: '6px', alignItems: 'center',
  padding: '8px 12px', borderRadius: 8,
  border: '1px solid var(--mat-sys-outline-variant)',
  background:
    'color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent)',
  minHeight: 44,
};

const INPUT: React.CSSProperties = {
  border: 'none', outline: 'none',
  background: 'transparent',
  color: 'var(--mat-sys-on-surface)',
  fontSize: 14, flex: 1, minWidth: 120,
};

/**
 * Tag input: type a skill, press Enter or comma.
 *
 * @param props - SkillTagInputProps.
 */
export const SkillTagInput: React.FC<
  SkillTagInputProps
> = ({
  skills, onAdd, onRemove,
  placeholder, label, testId,
}) => {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const commit = () => {
    const trimmed = value.replace(/,/g, '').trim();
    if (trimmed) { onAdd(trimmed); setValue(''); }
  };

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Backspace' && !value
      && skills.length > 0) {
      onRemove(skills[skills.length - 1]);
    }
  };

  return (
    <div
      style={WRAP}
      onClick={() => ref.current?.focus()}
    >
      {skills.map(s => (
        <SkillTag key={s} label={s}
          onRemove={onRemove} />
      ))}
      <input
        ref={ref}
        style={INPUT}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        onBlur={commit}
        placeholder={skills.length ? '' : placeholder}
        aria-label={label ?? 'Enter a skill'}
        data-testid={testId ?? 'skill-tag-input'}
      />
    </div>
  );
};

export default SkillTagInput;
