'use client';

import React, { useState } from 'react';
import { IconButton, Badge } from '@shared/m3';
import NotificationsIcon
  from '@shared/icons/react/m3/Notifications';
import { useTranslations } from 'next-intl';
import { useNotifications }
  from '@/hooks/useNotifications';
import NotificationPanel
  from './NotificationPanel';

/** Props for NotificationBell. */
export interface NotificationBellProps {
  /** Optional override for data-testid. */
  testId?: string;
}

/**
 * Navbar bell icon that polls the unread count
 * and opens a NotificationPanel popover on click.
 */
const NotificationBell: React.FC<
  NotificationBellProps
> = ({ testId = 'notification-bell' }) => {
  const t = useTranslations('notifications');
  const { unreadCount } = useNotifications();
  const [anchor, setAnchor] =
    useState<HTMLButtonElement | null>(null);

  const handleOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => setAnchor(e.currentTarget);

  const handleClose = () => setAnchor(null);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        data-testid={testId}
        aria-label={t('bellLabel')}
        color="inherit"
        size="medium"
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationPanel
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={handleClose}
      />
    </>
  );
};

export default NotificationBell;
