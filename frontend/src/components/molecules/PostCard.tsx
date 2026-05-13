'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import IconButton from '@/components/atoms/IconButton';
import { useTranslations } from 'next-intl';
import type { ForumPost } from '@/types/forum';

/** Props for PostCard. */
export interface PostCardProps {
  /** Post data to display. */
  post: ForumPost;
  /** Called when the user clicks the report button. */
  onFlag?: (id: string) => void;
}

/**
 * Renders a single forum reply with author, content,
 * timestamp, and a report flag button.
 *
 * @param props - Component props.
 * @returns Post card element.
 */
const PostCard: React.FC<PostCardProps> = ({
  post,
  onFlag,
}) => {
  const t = useTranslations('community');
  const date = new Date(post.created_at)
    .toLocaleDateString();

  return (
    <Box
      data-testid={`post-card-${post.id}`}
      aria-label={`Post by ${post.author_name}`}
      sx={{
        p: 2, mb: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        opacity: post.hidden ? 0.4 : 1,
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 0.5,
      }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700 }}
        >
          {post.author_name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5,
          alignItems: 'center' }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {date}
          </Typography>
          <IconButton
            size="small"
            aria-label={t('report')}
            data-testid={`flag-btn-${post.id}`}
            onClick={() => onFlag?.(post.id)}
          >
            🚩
          </IconButton>
        </Box>
      </Box>
      <Typography variant="body2">
        {post.content}
      </Typography>
    </Box>
  );
};

export default PostCard;
