'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { TextField } from '@/components/atoms/TextField';
import type { CreateThreadArgs } from '@/store/api/forumApi';

/** Props for NewThreadForm. */
export interface NewThreadFormProps {
  /** Pre-selected board slug (hides board selector). */
  boardSlug?: string;
  /** Called on valid submit. */
  onSubmit: (data: CreateThreadArgs) => void;
  /** Shows a spinner on the submit button. */
  loading?: boolean;
}

/**
 * Form for creating a new forum thread.
 * Hides the board selector when boardSlug is provided.
 *
 * @param props - Component props.
 * @returns New thread form.
 */
const NewThreadForm: React.FC<NewThreadFormProps> = ({
  boardSlug,
  onSubmit,
  loading = false,
}) => {
  const t = useTranslations('community');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      board_slug: boardSlug ?? '',
    });
    setTitle('');
    setContent('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      data-testid="new-thread-form"
      aria-label={t('newThread')}
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label={t('threads')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        inputProps={{
          'data-testid': 'thread-title-input',
          'aria-label': t('threads'),
        }}
      />
      <TextField
        label={t('reply')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
        multiline
        minRows={3}
        inputProps={{
          'data-testid': 'thread-content-input',
          'aria-label': t('reply'),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        data-testid="thread-submit-btn"
        aria-label={t('newThread')}
      >
        {t('newThread')}
      </Button>
    </Box>
  );
};

export default NewThreadForm;
