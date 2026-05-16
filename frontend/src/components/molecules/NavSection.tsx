'use client';

import React from 'react';
import { Collapse, List } from '@shared/m3';
import {
  DrawerNavItem,
} from '@shared/components/ui/DrawerNavItem';
import {
  NavSectionHeader,
} from '../atoms/NavSectionHeader';
import type { NavLink } from
  '../organisms/MobileDrawer';

/** Props for NavSection. */
export interface NavSectionProps {
  /** Section key used in aria and state. */
  sectionKey: string;
  /** Translated section label. */
  label: string;
  /** Links belonging to this section. */
  links: NavLink[];
  /** Whether the section is expanded. */
  open: boolean;
  /** Toggle the open state. */
  onToggle: () => void;
  /** Optional: close drawer on link click. */
  onClose?: () => void;
}

/**
 * Collapsible nav section with header + link list.
 * Used in both desktop NavLinks and mobile DrawerContent.
 *
 * @param props - Component props.
 * @returns Collapsible section with nav items.
 */
export const NavSection: React.FC<
  NavSectionProps
> = ({ sectionKey, label, links, open,
  onToggle, onClose }) => (
  <div
    data-testid={`nav-section-${sectionKey}`}
    role="group"
    aria-label={label}
  >
    <NavSectionHeader
      label={label}
      open={open}
      onToggle={onToggle}
    />
    <Collapse in={open}>
      <List disablePadding sx={{ pl: 1 }}>
        {links.map((l) => (
          <DrawerNavItem
            key={l.href}
            label={l.label}
            href={l.href}
            onClick={onClose ?? (() => { /* no-op */ })}
          />
        ))}
      </List>
    </Collapse>
  </div>
);

export default NavSection;
