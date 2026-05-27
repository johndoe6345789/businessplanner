/**
 * Shared style constants for ContactForm.
 * @module components/organisms/contactFormStyles
 */
import type { CSSProperties } from 'react';

/** Vertical flex container for a labelled field. */
export const FIELD: CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 6,
};

/** All-caps label style using M3 surface tokens. */
export const LABEL: CSSProperties = {
  fontSize: 13, fontWeight: 600,
  color: 'var(--mat-sys-on-surface-variant)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

/** Input / textarea base style. */
export const INPUT: CSSProperties = {
  padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--mat-sys-outline-variant)',
  background:
    'color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent)',
  color: 'var(--mat-sys-on-surface)',
  fontSize: 14, outline: 'none', fontFamily: 'inherit',
};

/** Pill-shaped primary action button. */
export const BTN: CSSProperties = {
  padding: '10px 28px', borderRadius: 999,
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary)',
  border: 'none', cursor: 'pointer',
  fontSize: 14, fontWeight: 600,
  alignSelf: 'flex-start',
};
