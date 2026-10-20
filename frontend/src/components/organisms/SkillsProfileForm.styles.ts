import type React from 'react';

/** Flex-column field wrapper. */
export const FIELD: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

/** Uppercase section label. */
export const LABEL: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--mat-sys-on-surface-variant)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

/** Text input / textarea base style. */
export const TEXT_INPUT: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border:
    '1px solid var(--mat-sys-outline-variant)',
  background:
    'color-mix(in srgb,'
    + ' var(--mat-sys-on-surface) 4%,'
    + ' transparent)',
  color: 'var(--mat-sys-on-surface)',
  fontSize: 14,
  outline: 'none',
};

/** Pill save button. */
export const SAVE_BTN: React.CSSProperties = {
  padding: '10px 24px',
  borderRadius: 999,
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary)',
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  alignSelf: 'flex-start',
};
