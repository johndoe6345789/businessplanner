'use client';

import React from 'react';
import {
  ListItem, ListItemText, ListItemIcon,
  Box, Typography,
} from '@shared/m3';
import NotificationsIcon
  from '@shared/icons/react/m3/Notifications';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import type { Notification }
  from '@/types/notifications';
import {
  useMarkNotificationReadMutation,
} from '@/store/api/notificationsApi';
import { formatRelativeTime }
  from '@/utils/relativeTime';

/** Props for NotificationItem. */
export interface NotificationItemProps {
  /** Notification data to render. */
  notification: Notification;
}

/**
 * Single notification row with icon, title, body,
 * timestamp and an unread-dot indicator.
 * Clicking marks read and navigates to action link.
 */
const NotificationItem: React.FC<
  NotificationItemProps
> = ({ notification: n }) => {
  const t = useTranslations('notifications');
  const router = useRouter();
  const [markRead] = useMarkNotificationReadMutation();

  const handleClick = async () => {
    if (!n.is_read) await markRead(n.id);
    const href = n.links?.[0]?.href;
    if (href) router.push(href);
  };

  return (
    <ListItem
      component="li"
      onClick={handleClick}
      data-testid={`notification-item-${n.id}`}
      aria-label={n.title}
      sx={{
        cursor: 'pointer',
        bgcolor: n.is_read
          ? 'transparent' : 'action.hover',
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
        <NotificationsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2"
            fontWeight={n.is_read ? 400 : 600} noWrap
          >
            {n.title}
          </Typography>
        }
        secondary={
          <Box component="span"
            display="flex" flexDirection="column"
          >
            <Typography variant="caption" noWrap
              sx={{ maxWidth: 220 }}
            >
              {n.body}
            </Typography>
            <Typography variant="caption"
              color="text.disabled"
            >
              {formatRelativeTime(n.created_at, t)}
            </Typography>
          </Box>
        }
      />
      {!n.is_read && (
        <Box component="span" sx={{
          width: 8, height: 8, flexShrink: 0,
          borderRadius: '50%',
          bgcolor: 'primary.main', mt: 1,
          display: 'inline-block',
        }} aria-label={t('unread')} />
      )}
    </ListItem>
  );
};

export default NotificationItem;
