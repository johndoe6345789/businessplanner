'use client';

/**
 * ListItemButton rendered as a locale-aware Link.
 * Keeps the Link function reference inside a Client
 * Component so it is never serialised across the
 * Server → Client boundary (React 19 constraint).
 * @module components/atoms/LinkedListItemButton
 */
import React from 'react';
import ListItemButton from '@shared/m3/ListItemButton';
import { Link } from '@/i18n/navigation';

/** Props for LinkedListItemButton. */
export interface LinkedListItemButtonProps {
  /** Navigation href (locale-aware). */
  readonly href: string;
  /** Accessible label. */
  readonly 'aria-label': string;
  /** data-testid attribute. */
  readonly 'data-testid'?: string;
  /** Children rendered inside the button. */
  readonly children: React.ReactNode;
}

/**
 * List item rendered as a locale-aware Link.
 * @param props - Href, label, testId, and children.
 * @returns ListItemButton rendered as a Link.
 */
const LinkedListItemButton: React.FC<
  LinkedListItemButtonProps
> = ({ href, children, ...rest }) => (
  <ListItemButton component={Link} href={href} {...rest}>
    {children}
  </ListItemButton>
);

export default LinkedListItemButton;
