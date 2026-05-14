'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import type { ForumThread } from '@/types/forum';

/** Props for FeedItem. */
export interface FeedItemProps {
  /** Thread data to render as feed activity. */
  thread: ForumThread;
}

/**
 * Single activity-feed item showing a thread
 * creation event. Clicking navigates to the thread.
 *
 * @param props - Component props.
 * @returns Feed item element.
 */
const FeedItem: React.FC<FeedItemProps> = ({
  thread,
}) => {
  const t = useTranslations('feed');
  const date = new Date(thread.created_at)
    .toLocaleDateString();

  return (
    <Link
      href={`/community/board/${thread.id}`}
      data-testid="feed-item-link"
      aria-label={
        `${thread.author_name} ` +
        `${t('startedThread')} ${thread.title}`
      }
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Box
        data-testid={`feed-item-${thread.id}`}
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            width: 36, height: 36,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontWeight: 700,
            fontSize: 14,
          }}
          aria-hidden="true"
        >
          {thread.author_name.charAt(0).toUpperCase()}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2">
            <strong>{thread.author_name}</strong>
            {' '}{t('startedThread')}{' '}
            <em>{thread.title}</em>
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {date}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default FeedItem;
