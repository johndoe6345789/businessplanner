'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import {
  useMarkAllReadMutation,
} from '@/store/api/notificationsApi';

/**
 * Header row of the notification panel showing
 * the title and a "mark all read" action button.
 */
const NotificationPanelHeader: React.FC = () => {
  const t = useTranslations('notifications');
  const [markAll, { isLoading }] =
    useMarkAllReadMutation();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={2}
      py={1}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
      >
        {t('title')}
      </Typography>
      <Button
        size="small"
        onClick={() => markAll()}
        disabled={isLoading}
        aria-label={t('markAllRead')}
        data-testid="mark-all-read-btn"
      >
        {isLoading
          ? <CircularProgress size={14} />
          : t('markAllRead')}
      </Button>
    </Box>
  );
};

export default NotificationPanelHeader;
