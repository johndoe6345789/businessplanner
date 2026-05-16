'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import { TextField } from '@/components/atoms/TextField';
import { useTranslations } from 'next-intl';
import { useReplyToThreadMutation }
  from '@/store/api/forumApi';

/** Props for ReplyForm. */
export interface ReplyFormProps {
  /** ID of the thread to reply to. */
  threadId: string;
}

/**
 * Inline reply form for a forum thread.
 *
 * @param props - Component props.
 * @returns Reply form element.
 */
const ReplyForm: React.FC<ReplyFormProps> = ({
  threadId,
}) => {
  const t = useTranslations('community');
  const [text, setText] = useState('');
  const [reply, { isLoading }] =
    useReplyToThreadMutation();

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    if (!text.trim()) return;
    await reply({ id: threadId, content: text });
    setText('');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      data-testid="reply-form"
      aria-label={t('reply')}
      sx={{ mt: 3, display: 'flex',
        flexDirection: 'column', gap: 1 }}
    >
      <TextField
        label={t('reply')}
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        minRows={3}
        fullWidth
        required
        testId="reply-input"
        inputProps={{ 'aria-label': t('reply') }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        data-testid="reply-submit-btn"
        aria-label={t('reply')}
        sx={{ alignSelf: 'flex-end' }}
      >
        {t('reply')}
      </Button>
    </Box>
  );
};

export default ReplyForm;
