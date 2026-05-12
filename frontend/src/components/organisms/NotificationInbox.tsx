'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, List,
  Divider, Skeleton, Pagination,
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

/** Full paginated notification inbox. */
const NotificationInbox: React.FC = () => {
  const t = useTranslations('notifications');
  const [page, setPage] = useState(1);
  const { data, isLoading } =
    useListNotificationsQuery({
      page,
      per_page: notifConstants.PAGE_SIZE,
    });
  const [markAll, { isLoading: marking }] =
    useMarkAllReadMutation();

  const items = data?.notifications ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.ceil(
    total / notifConstants.PAGE_SIZE,
  );

  return (
    <Box data-testid="notification-inbox">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" component="h2">
          {t('inboxTitle')}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => markAll()}
          disabled={marking || items.length === 0}
          aria-label={t('markAllRead')}
          data-testid="inbox-mark-all-read"
        >
          {t('markAllRead')}
        </Button>
      </Box>
      <Divider />
      {isLoading ? (
        <Box>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={60} sx={{ mb: 1 }} />
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          py={4}
          textAlign="center"
          data-testid="no-notifications"
        >
          {t('noNotifications')}
        </Typography>
      ) : (
        <>
          <List disablePadding>
            {items.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </List>
          {pageCount > 1 && (
            <Box display="flex"
              justifyContent="center" mt={2}
            >
              <Pagination count={pageCount} page={page}
                onChange={(_, p) => setPage(p)}
                aria-label={t('pagination')}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default NotificationInbox;
