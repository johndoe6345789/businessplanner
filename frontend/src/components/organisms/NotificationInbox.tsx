'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, List,
  Divider, Skeleton,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import {
  useListNotificationsQuery,
  useMarkAllReadMutation,
} from '@/store/api/notificationsApi';
import notifConstants
  from '@/constants/notifications.json';
import NotificationItem
  from '@/components/molecules/NotificationItem';
import NotificationPager
  from '@/components/molecules/NotificationPager';

/** Full paginated notification inbox. */
const NotificationInbox: React.FC = () => {
  const t = useTranslations('notifications');
  const [page, setPage] = useState(1);
  const { data, isLoading } =
    useListNotificationsQuery({
      page, per_page: notifConstants.PAGE_SIZE,
    });
  // No clear-all endpoint; markAllRead reuses the
  // same mutation (clears unread state server-side).
  const [markAll, { isLoading: marking }] =
    useMarkAllReadMutation();
  const items = data?.notifications ?? [];
  const pageCount = Math.ceil(
    (data?.total ?? 0) / notifConstants.PAGE_SIZE,
  );

  return (
    <Box data-testid="notification-inbox">
      <Box display="flex" alignItems="center"
        justifyContent="space-between" mb={2}
      >
        <Typography variant="h5" component="h2">
          {t('inboxTitle')}
        </Typography>
        {items.length > 0 && (
          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small"
              onClick={() => markAll()}
              disabled={marking}
              aria-label={t('markAllRead')}
              data-testid="inbox-mark-all-read"
            >
              {t('markAllRead')}
            </Button>
            <Button variant="outlined" size="small"
              onClick={() => markAll()}
              disabled={marking}
              aria-label={t('clearAll')}
              data-testid="inbox-clear-all"
            >
              {t('clearAll')}
            </Button>
          </Box>
        )}
      </Box>
      <Divider />
      {isLoading ? (
        <Box>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={60}
              style={{ marginBottom: 8 }}
            />
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Typography variant="body1"
          color="text.secondary" align="center"
          sx={{ py: 4 }}
          data-testid="no-notifications"
        >
          {t('noNotifications')}
        </Typography>
      ) : (
        <>
          <List disablePadding>
            {items.map((n) => (
              <NotificationItem key={n.id}
                notification={n}
              />
            ))}
          </List>
          <NotificationPager pageCount={pageCount}
            page={page} onPageChange={setPage}
          />
        </>
      )}
    </Box>
  );
};
export default NotificationInbox;
