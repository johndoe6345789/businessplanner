'use client';

import React from 'react';
import {
  Popover, Box, Typography, Button,
  List, Divider, Skeleton,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  useListNotificationsQuery,
} from '@/store/api/notificationsApi';
import notifConstants
  from '@/constants/notifications.json';
import NotificationItem from './NotificationItem';
import NotificationPanelHeader
  from './NotificationPanelHeader';

/** Props for NotificationPanel. */
export interface NotificationPanelProps {
  /** Anchor element for the Popover. */
  anchorEl: HTMLElement | null;
  /** Whether the panel is open. */
  open: boolean;
  /** Close callback. */
  onClose: () => void;
}

/**
 * Popover panel showing recent notifications
 * with mark-all-read and a view-all footer link.
 */
const NotificationPanel: React.FC<
  NotificationPanelProps
> = ({ anchorEl, open, onClose }) => {
  const t = useTranslations('notifications');
  const { data, isLoading } =
    useListNotificationsQuery(
      { page: 1, per_page: notifConstants.PANEL_PREVIEW_COUNT },
      { skip: !open },
    );
  const items = data?.notifications ?? [];

  return (
    <Popover
      open={open} anchorEl={anchorEl} onClose={onClose}
      data-testid="notification-panel"
      aria-label={t('panelLabel')}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      style={{ width: 340, maxHeight: 480, overflow: 'auto' }}
    >
      <NotificationPanelHeader />
      <Divider />
      {isLoading ? (
        <Box px={2} py={1}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={52}
              style={{ marginBottom: 4 }} />
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Typography variant="body2"
          color="text.secondary" sx={{ px: 2, py: 2 }}
        >
          {t('noNotifications')}
        </Typography>
      ) : (
        <List disablePadding>
          {items.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </List>
      )}
      <Divider />
      <Box display="flex" justifyContent="center" py={1}>
        <Button
          component={Link} href="/notifications"
          size="small" onClick={onClose}
          aria-label={t('viewAll')}
          data-testid="view-all-link"
        >
          {t('viewAll')}
        </Button>
      </Box>
    </Popover>
  );
};

export default NotificationPanel;
