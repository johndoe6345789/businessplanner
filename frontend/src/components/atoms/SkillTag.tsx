'use client';

/**
 * @file SkillTag.tsx
 * @brief Removable chip for a single skill label.
 */
import React from 'react';

/** Props for SkillTag. */
export interface SkillTagProps {
  /** Skill label to display. */
  label: string;
  /** Called when the × button is clicked. */
  onRemove: (label: string) => void;
  /** data-testid prefix. */
  testId?: string;
}

const TAG: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 10px 3px 12px',
  borderRadius: 999,
  background: 'color-mix(in srgb, var(--mat-sys-primary) 15%, transparent)',
  color: 'var(--mat-sys-on-surface)',
  fontSize: 13,
  lineHeight: 1.4,
  fontWeight: 500,
  whiteSpace: 'nowrap' as const,
};

const REMOVE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0 2px',
  lineHeight: 1,
  fontSize: 14,
  opacity: 0.6,
  color: 'inherit',
};

/**
 * Chip displaying a skill with a remove button.
 *
 * @param props - SkillTagProps.
 */
export const SkillTag: React.FC<SkillTagProps> = ({
  label, onRemove, testId,
}) => (
  <span
    style={TAG}
    data-testid={testId ?? `skill-tag-${label}`}
  >
    {label}
    <button
      type="button"
      style={REMOVE}
      aria-label={`Remove ${label}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onRemove(label);
      }}
    >
      ×
    </button>
  </span>
);

export default SkillTag;
