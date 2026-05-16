'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Divider from '@shared/m3/Divider';
import { useNavSections } from '@/hooks/useNavSections';
import { NavSection } from '../molecules/NavSection';
import { DrawerFooter } from '../molecules/DrawerFooter';
import {
  DrawerToolLinks,
} from '../molecules/DrawerToolLinks';
import navGroups from '@/constants/nav-groups.json';
import type { NavLink } from './MobileDrawer';

/** Props for DrawerContent. */
export interface DrawerContentProps {
  /** Navigation links. */
  links: NavLink[];
  /** Close the drawer on link click. */
  onClose: () => void;
}

/**
 * Scrollable drawer body with grouped, collapsible nav
 * sections, tool links, and footer.
 *
 * @param props - Component props.
 */
export const DrawerContent: React.FC<
  DrawerContentProps
> = ({ links, onClose }) => {
  const t = useTranslations('nav');
  const { open, toggle } = useNavSections();

  const grouped = navGroups.map((g) => ({
    ...g,
    label: t(g.labelKey as Parameters<typeof t>[0]),
    links: links.filter((l) => l.section === g.key),
  }));

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}
      role="menu"
    >
      <Divider />
      {grouped.map((g) => (
        <NavSection
          key={g.key}
          sectionKey={g.key}
          label={g.label}
          links={g.links}
          open={open[g.key] ?? g.defaultOpen}
          onToggle={() => toggle(g.key)}
          onClose={onClose}
        />
      ))}
      <Divider />
      <DrawerToolLinks excludeUrls={['/app']} />
      <Divider />
      <DrawerFooter />
    </div>
  );
};

export default DrawerContent;
