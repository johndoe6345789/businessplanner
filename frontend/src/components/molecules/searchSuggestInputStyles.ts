/**
 * Inline style presets for the search input wrapper used
 * in SearchInput. Extracted from searchSuggestStyles to
 * keep both files under the 100-LOC project cap.
 *
 * @module components/molecules/searchSuggestInputStyles
 */
import type { CSSProperties } from 'react';

export const INPUT_WRAP: CSSProperties = {
  display: 'flex', alignItems: 'center',
  height: 36, borderRadius: 999, gap: 6,
  padding: '0 10px',
  border: '1px solid var(--mat-sys-outline-variant)',
  background: 'color-mix(in srgb,'
    + ' var(--mat-sys-on-surface) 4%, transparent)',
  transition: 'border-color 0.15s',
};

export const SEARCH_INPUT: CSSProperties = {
  flex: 1, border: 'none', outline: 'none',
  background: 'transparent', fontSize: 13,
  color: 'inherit', minWidth: 0,
};

export const ICON_WRAP: CSSProperties = {
  flexShrink: 0, opacity: 0.45,
  display: 'flex', alignItems: 'center',
};

export const CLEAR_BTN: CSSProperties = {
  flexShrink: 0, background: 'none',
  border: 'none', cursor: 'pointer',
  padding: '0 2px', opacity: 0.55,
  fontSize: 16, lineHeight: '1',
  color: 'inherit',
};
