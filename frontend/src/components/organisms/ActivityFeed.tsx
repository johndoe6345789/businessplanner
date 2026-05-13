'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import FeedItem from '@/components/molecules/FeedItem';
import { useTranslations } from 'next-intl';
import { useListThreadsQuery } from '@/store/api/forumApi';

/**
 * Activity feed showing recent threads across all boards.
 * Loads from /api/forum/threads with no board filter (v1).
 * A proper follows-based feed is v2.
 *
 * @returns Activity feed organism.
 */
const ActivityFeed: React.FC = () => {
  const t = useTranslations('feed');
  const { data, isLoading } = useListThreadsQuery({
    board: '',
    page: 1,
  });

  const threads = data?.threads ?? [];

  if (isLoading) {
    return (
      <Typography
        data-testid="feed-loading"
        aria-live="polite"
      >
        {t('title')}…
      </Typography>
    );
  }

  if (!threads.length) {
    return (
      <Typography data-testid="feed-empty">
        {t('noActivity')}
      </Typography>
    );
  }

  return (
    <Box
      data-testid="activity-feed"
      aria-label={t('title')}
    >
      {threads.map((thread) => (
        <FeedItem key={thread.id} thread={thread} />
      ))}
    </Box>
  );
};

export default ActivityFeed;
