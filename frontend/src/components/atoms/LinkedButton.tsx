'use client';

/**
 * Button rendered as a locale-aware Link.
 * Keeps the Link function reference inside a Client
 * Component so it is never serialised across the
 * Server → Client boundary (React 19 constraint).
 * @module components/atoms/LinkedButton
 */
import React from 'react';
import Button from '@shared/m3/Button';
import { Link } from '@/i18n/navigation';
import type { ButtonProps } from '@shared/m3/Button';

/** Props for LinkedButton (extends ButtonProps). */
export type LinkedButtonProps = Omit<
  ButtonProps, 'component' | 'href'
> & {
  /** Navigation href (locale-aware). */
  readonly href: string;
};

/**
 * Button that navigates to href when clicked.
 * @param props - ButtonProps minus component/href, plus href.
 * @returns Button rendered as a locale-aware Link.
 */
const LinkedButton: React.FC<LinkedButtonProps> = ({
  href, children, ...rest
}) => (
  <Button component={Link} href={href} {...rest}>
    {children}
  </Button>
);

export default LinkedButton;
