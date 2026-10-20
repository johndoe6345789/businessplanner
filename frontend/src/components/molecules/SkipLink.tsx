'use client';

import React from 'react';

/** Props for the SkipLink component. */
export interface SkipLinkProps {
  /** Visible label text. */
  label: string;
  /** data-testid for testing. */
  testId?: string;
}

/**
 * Visually hidden skip-to-content link that
 * appears on focus for keyboard navigation.
 *
 * @param props - Component props.
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  label,
  testId = 'skip-to-content',
}) => (
  <a
    href="#main-content"
    data-testid={testId}
    tabIndex={0}
    style={{
      position: 'fixed',
      left: '-9999px',
      top: 8,
      zIndex: 9999,
      padding: '8px 16px',
      borderRadius: 4,
      textDecoration: 'none',
      fontWeight: 600,
      background:
        'var(--mui-palette-primary-main)',
      color:
        'var(--mui-palette-primary-contrastText)',
    }}
    onFocus={(e) => {
      e.currentTarget.style.left = '8px';
    }}
    onBlur={(e) => {
      e.currentTarget.style.left = '-9999px';
    }}
  >
    {label}
  </a>
);

export default SkipLink;
