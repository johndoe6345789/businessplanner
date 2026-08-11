'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';

/** Props for NavSectionHeader. */
export interface NavSectionHeaderProps {
  /** Displayed section label. */
  label: string;
  /** Whether the section is expanded. */
  open: boolean;
  /** Toggle the section. */
  onToggle: () => void;
}

const CHEVRON_STYLE: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '0.65rem',
  marginLeft: 4,
  transition: 'transform 200ms',
};

/**
 * Clickable nav section header with expand/collapse
 * chevron indicator.
 *
 * @param props - Component props.
 * @returns Styled button acting as a list subheader.
 */
export const NavSectionHeader: React.FC<
  NavSectionHeaderProps
> = ({ label, open, onToggle }) => (
  <Box
    component="button"
    onClick={onToggle}
    aria-expanded={open}
    data-testid={`nav-group-${label.toLowerCase().replace(/\s+/g, '-')}`}
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      px: 2, py: 0.75,
    }}
  >
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'text.secondary',
      }}
    >
      {label}
    </Typography>
    <span
      style={{
        ...CHEVRON_STYLE,
        transform: open
          ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
      aria-hidden
    >
      ▾
    </span>
  </Box>
);

export default NavSectionHeader;
