'use client';

import React from 'react';
import NotificationsIcon
  from '@shared/icons/Notifications';
import ChatIcon from '@shared/icons/Chat';
import StarIcon from '@shared/icons/Star';
import TrendUpIcon from '@shared/icons/TrendUp';
import UserPlusIcon from '@shared/icons/UserPlus';

/** Props for NotificationTypeIcon. */
export interface NotificationTypeIconProps {
  /**
   * Notification type token from the API
   * (e.g. "reply", "badge", "xp", "follow").
   */
  type: string;
}

/**
 * Maps a notification type to the appropriate icon.
 * Falls back to the generic bell for unknown types.
 *
 * @param props - Icon props including type token.
 * @returns Icon element sized for a list row.
 */
const NotificationTypeIcon: React.FC<
  NotificationTypeIconProps
> = ({ type }) => {
  const sz = 20;
  switch (type) {
    case 'reply':
      return <ChatIcon size={sz} aria-hidden="true" />;
    case 'badge':
      return <StarIcon size={sz} aria-hidden="true" />;
    case 'xp':
      return (
        <TrendUpIcon size={sz} aria-hidden="true" />
      );
    case 'follow':
      return (
        <UserPlusIcon size={sz} aria-hidden="true" />
      );
    default:
      return (
        <NotificationsIcon
          size={sz}
          aria-hidden="true"
        />
      );
  }
};

export default NotificationTypeIcon;
