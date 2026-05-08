/**
 * Inline style presets for SearchSuggestDropdown.
 * Pulled out so the component file stays under the
 * 100-LOC project cap.
 *
 * @module components/molecules/searchSuggestStyles
 */
import type { CSSProperties } from 'react';

export const PANEL: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  background: 'var(--md-sys-color-surface-container)',
  border:
    '1px solid var(--md-sys-color-outline-variant)',
  borderRadius: 12,
  boxShadow: '0 12px 32px rgba(0,0,0,0.32)',
  zIndex: 1300,
  overflow: 'hidden',
};

export const LIST: CSSProperties = {
  listStyle: 'none', margin: 0, padding: 0,
};

export const ROW_TOP: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
};

export const BADGE: CSSProperties = {
  fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase',
  padding: '2px 8px', borderRadius: 999,
  background: 'var(--md-sys-color-secondary-container)',
  color: 'var(--md-sys-color-on-secondary-container)',
  flexShrink: 0,
};

export const TITLE: CSSProperties = {
  fontWeight: 600, whiteSpace: 'nowrap',
  overflow: 'hidden', textOverflow: 'ellipsis',
};

export const SNIPPET: CSSProperties = {
  fontSize: 13, opacity: 0.7,
  whiteSpace: 'nowrap', overflow: 'hidden',
  textOverflow: 'ellipsis', marginTop: 2,
};

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

export const EMPTY_STATE: CSSProperties = {
  padding: '14px 16px', fontSize: 13,
  opacity: 0.65, textAlign: 'center',
};

/** Per-row style with active-state background. */
export function rowStyle(active: boolean): CSSProperties {
  return {
    padding: '10px 14px',
    cursor: 'pointer',
    background: active
      ? 'var(--md-sys-color-surface-container-high)'
      : 'transparent',
  };
}

/** Footer "view all" row style. */
export function viewAllStyle(
  active: boolean,
): CSSProperties {
  return {
    padding: '12px 14px',
    cursor: 'pointer',
    fontWeight: 600,
    borderTop:
      '1px solid var(--md-sys-color-outline-variant)',
    background: active
      ? 'var(--md-sys-color-surface-container-high)'
      : 'transparent',
  };
}
