'use client';

import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import s from '@shared/scss/modules/DesktopActions.module.scss';

/**
 * Desktop toolbar: theme toggle and locale
 * switcher.
 */
export const DesktopActions: React.FC = () => (
  <div
    className={s.root}
    data-testid="navbar-desktop-actions"
  >
    <ThemeToggle />
    <div
      className={s.locale}
      data-testid="locale-pill"
    >
      <LocaleSwitcher />
    </div>
  </div>
);

export default DesktopActions;
