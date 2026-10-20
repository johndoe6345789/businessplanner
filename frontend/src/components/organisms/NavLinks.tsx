'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useNavSections } from '@/hooks/useNavSections';
import { NavSection } from '../molecules/NavSection';
import navGroups from '@/constants/nav-groups.json';
import type { NavLink } from './MobileDrawer';
import s from '@shared/scss/modules/NavLinks.module.scss';

/** Props for NavLinks. */
export interface NavLinksProps {
  /** Links to display. */
  links: NavLink[];
}

/**
 * Desktop nav: links grouped into collapsible sections.
 * Section open/closed state is persisted to localStorage.
 *
 * @param props - Component props.
 * @returns Grouped, collapsible nav section elements.
 */
export const NavLinks: React.FC<
  NavLinksProps
> = ({ links }) => {
  const t = useTranslations('nav');
  const { open, toggle } = useNavSections();

  const grouped = navGroups.map((g) => ({
    ...g,
    label: t(g.labelKey as Parameters<typeof t>[0]),
    links: links.filter((l) => l.section === g.key),
  }));

  return (
    <nav
      className={s.root}
      aria-label="Main"
      data-testid="nav-links"
    >
      {grouped.map((g) => (
        <NavSection
          key={g.key}
          sectionKey={g.key}
          label={g.label}
          links={g.links}
          open={open[g.key] ?? g.defaultOpen}
          onToggle={() => toggle(g.key)}
        />
      ))}
    </nav>
  );
};

export default NavLinks;
