'use client';

/**
 * CardActionArea that renders as a locale-aware Link.
 * Keeps the Link function reference inside a Client
 * Component so it is never serialised across the
 * Server → Client boundary (React 19 constraint).
 * @module components/atoms/LinkedCardActionArea
 */
import React from 'react';
import CardActionArea from '@shared/m3/CardActionArea';
import { Link } from '@/i18n/navigation';

/** Props for LinkedCardActionArea. */
export interface LinkedCardActionAreaProps {
  /** Navigation href (locale-aware). */
  readonly href: string;
  /** Accessible label for the link. */
  readonly 'aria-label': string;
  /** Card content. */
  readonly children: React.ReactNode;
}

/**
 * Clickable card area that navigates to href.
 * @param props - Href, label, and children.
 * @returns CardActionArea rendered as a Link.
 */
const LinkedCardActionArea: React.FC<
  LinkedCardActionAreaProps
> = ({ href, children, ...rest }) => (
  <CardActionArea component={Link} href={href} {...rest}>
    {children}
  </CardActionArea>
);

export default LinkedCardActionArea;
