'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import {
  useListThreadsQuery,
  useCreateThreadMutation,
  type CreateThreadArgs,
} from '@/store/api/forumApi';
import NewThreadForm from '@/components/molecules/NewThreadForm';
import ThreadRow from '@/components/molecules/ThreadRow';
import { useRouter } from '@/i18n/navigation';

/** Props for ThreadList. */
export interface ThreadListProps {
  /** Board slug to display threads for. */
  boardSlug: string;
}

/**
 * Paginated thread list for a board with New Thread.
 * @param props - Component props.
 * @returns Thread list organism.
 */
const ThreadList: React.FC<ThreadListProps> = ({
  boardSlug,
}) => {
  const t = useTranslations('community');
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useListThreadsQuery(
    { board: boardSlug, page },
  );
  const [createThread, { isLoading: creating }] =
    useCreateThreadMutation();
  const threads = data?.threads ?? [];

  const handleCreate = async (
    args: CreateThreadArgs,
  ) => {
    await createThread(args);
    setShowForm(false);
  };

  return (
    <Box
      data-testid="thread-list"
      aria-label={t('threads')}
    >
      <Box sx={{ display: 'flex',
        justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained"
          onClick={() => setShowForm((v) => !v)}
          data-testid="new-thread-btn"
          aria-label={t('newThread')}>
          {t('newThread')}
        </Button>
      </Box>
      {showForm && (
        <Box sx={{ mb: 3 }}>
          <NewThreadForm boardSlug={boardSlug}
            onSubmit={handleCreate}
            loading={creating} />
        </Box>
      )}
      {isLoading && (
        <Typography aria-live="polite">
          {t('loadingThreads')}
        </Typography>
      )}
      {!isLoading && !threads.length && (
        <Typography data-testid="no-threads">
          {t('noThreads')}
        </Typography>
      )}
      {threads.map((thread) => (
        <ThreadRow key={thread.id} thread={thread}
          onClick={(id) => router.push(
            `/community/${boardSlug}/${id}` as never,
          )} />
      ))}
      {(data?.total ?? 0) > threads.length && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous page">‹</Button>
          <Button
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page">›</Button>
        </Box>
      )}
    </Box>
  );
};
export default ThreadList;
