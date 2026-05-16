'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Skeleton from '@shared/m3/Skeleton';
import FeedItem from '@/components/molecules/FeedItem';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useListThreadsQuery } from '@/store/api/forumApi';
import { Sparkle as SparkleIcon } from '@shared/icons/Sparkle';

/**
 * Activity feed showing recent threads across all
 * boards. Loads from /api/forum/threads with no
 * board filter (v1). A follows-based feed is v2.
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
      <Box
        data-testid="feed-loading"
        aria-live="polite"
        aria-busy="true"
      >
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={72}
            style={{ borderRadius: 16, marginBottom: 8 }}
          />
        ))}
      </Box>
    );
  }

  if (!threads.length) {
    return (
      <Box
        data-testid="feed-empty"
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={6}
        gap={2}
      >
        <SparkleIcon
          size={48}
          aria-hidden="true"
          style={{ opacity: 0.4 }}
        />
        <Typography variant="h6" fontWeight={700}>
          {t('emptyTitle')}
        </Typography>
        <Link
          href="/community"
          data-testid="feed-empty-cta"
          aria-label={t('emptyCta')}
        >
          <Typography
            variant="body2"
            color="primary"
          >
            {t('emptyCta')}
          </Typography>
        </Link>
      </Box>
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
