'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import {
  useListFlaggedQuery,
  useHideContentMutation,
  useClearFlagsMutation,
} from '@/store/api/forumModerationApi';

/**
 * Admin moderation queue: lists flagged posts with
 * hide and clear-flags action buttons.
 *
 * @returns Moderation queue organism.
 */
const ModerationQueue: React.FC = () => {
  const t = useTranslations('moderation');
  const { data: posts = [], isLoading } =
    useListFlaggedQuery();
  const [hide] = useHideContentMutation();
  const [clearFlags] = useClearFlagsMutation();

  if (isLoading) {
    return (
      <Typography aria-live="polite">
        {t('title')}…
      </Typography>
    );
  }

  if (!posts.length) {
    return (
      <Typography data-testid="modq-empty">
        {t('noFlagged')}
      </Typography>
    );
  }

  return (
    <Box
      data-testid="moderation-queue"
      aria-label={t('title')}
    >
      <Typography
        variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {t('title')}
      </Typography>
      {posts.map((post) => (
        <Box
          key={post.id}
          data-testid={`modq-item-${post.id}`}
          aria-label={`Flagged post ${post.id}`}
          sx={{
            p: 2, mb: 1,
            border: '1px solid',
            borderColor: 'warning.main',
            borderRadius: 2,
            opacity: post.hidden ? 0.5 : 1,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>{post.author_name}</strong>
            {': '}
            {post.content}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => hide(post.id)}
              data-testid={`hide-btn-${post.id}`}
              aria-label={`${t('hide')} ${post.id}`}
            >
              {t('hide')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => clearFlags(post.id)}
              data-testid={`clear-btn-${post.id}`}
              aria-label={
                `${t('clearFlags')} ${post.id}`
              }
            >
              {t('clearFlags')}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ModerationQueue;
