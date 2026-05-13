'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import type { ForumThread } from '@/types/forum';

/** Props for ThreadRow. */
export interface ThreadRowProps {
  /** Thread data to render. */
  thread: ForumThread;
  /** Called when the row is clicked. */
  onClick: (id: string) => void;
}

/**
 * A single row in a thread list.
 * Shows title, author, reply count, and date.
 *
 * @param props - Component props.
 * @returns Thread row element.
 */
const ThreadRow: React.FC<ThreadRowProps> = ({
  thread,
  onClick,
}) => {
  const t = useTranslations('community');
  const date = new Date(thread.created_at)
    .toLocaleDateString();

  return (
    <Box
      data-testid={`thread-row-${thread.id}`}
      aria-label={thread.title}
      onClick={() => onClick(thread.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === 'Enter' && onClick(thread.id)
      }
      sx={{
        p: 2, mb: 1, cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700 }}
      >
        {thread.title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {thread.author_name}
        {' · '}
        {thread.post_count} {t('reply')}
        {' · '}
        {date}
      </Typography>
    </Box>
  );
};

export default ThreadRow;
