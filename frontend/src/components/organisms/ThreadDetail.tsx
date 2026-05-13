'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import PostCard from '@/components/molecules/PostCard';
import ReplyForm from '@/components/molecules/ReplyForm';
import { useTranslations } from 'next-intl';
import { useGetThreadQuery }
  from '@/store/api/forumApi';
import { useFlagContentMutation }
  from '@/store/api/forumApi';

/** Props for ThreadDetail. */
export interface ThreadDetailProps {
  /** Thread ID to load. */
  threadId: string;
}

/**
 * Full thread view: title, original post, replies,
 * and reply form.
 *
 * @param props - Component props.
 * @returns Thread detail organism.
 */
const ThreadDetail: React.FC<ThreadDetailProps> = ({
  threadId,
}) => {
  const t = useTranslations('community');
  const { data, isLoading } =
    useGetThreadQuery(threadId);
  const [flag] = useFlagContentMutation();

  if (isLoading || !data) {
    return (
      <Typography aria-live="polite">
        {t('threads')}…
      </Typography>
    );
  }

  return (
    <Box
      data-testid="thread-detail"
      aria-label={data.thread.title}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 2 }}
      >
        {data.thread.title}
      </Typography>
      <PostCard
        post={{
          id: data.thread.id,
          thread_id: data.thread.id,
          content: data.thread.content,
          author_id: data.thread.author_id,
          author_name: data.thread.author_name,
          created_at: data.thread.created_at,
          flag_count: 0,
          hidden: false,
        }}
        onFlag={flag}
      />
      {data.posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onFlag={flag}
        />
      ))}
      <ReplyForm threadId={threadId} />
    </Box>
  );
};

export default ThreadDetail;
