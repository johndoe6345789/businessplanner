'use client';

/**
 * @file KbFeedbackBar.tsx
 * @brief "Was this helpful?" thumbs up/down bar for KB
 *        articles. Shows current counts after voting.
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import IconButton from '@shared/m3/IconButton';
import {
  useSubmitFeedbackMutation,
  useGetFeedbackSummaryQuery,
} from '@/store/api/kbFeedbackApi';

/** Props for KbFeedbackBar. */
export interface KbFeedbackBarProps {
  /** KB article (wiki page) ID. */
  articleId: number;
}

/**
 * Displays thumbs-up / thumbs-down buttons for a KB
 * article and shows aggregate vote counts after voting.
 *
 * @param props - Component props.
 * @returns Feedback bar element.
 */
export const KbFeedbackBar: React.FC<
  KbFeedbackBarProps
> = ({ articleId }) => {
  const t = useTranslations('knowledge');
  const [voted, setVoted] = useState<boolean | null>(
    null,
  );

  const { data: summary } = useGetFeedbackSummaryQuery(
    articleId,
    { skip: voted === null },
  );

  const [submit, { isLoading }] =
    useSubmitFeedbackMutation();

  const vote = async (helpful: boolean) => {
    if (isLoading) return;
    await submit({ id: articleId, helpful });
    setVoted(helpful);
  };

  return (
    <Box
      data-testid="kb-feedback-bar"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('feedbackPrompt')}
      </Typography>
      <IconButton
        aria-label={t('feedbackHelpful')}
        onClick={() => vote(true)}
        disabled={isLoading}
        data-testid="kb-feedback-helpful"
        size="small"
      >
        👍
      </IconButton>
      <IconButton
        aria-label={t('feedbackUnhelpful')}
        onClick={() => vote(false)}
        disabled={isLoading}
        data-testid="kb-feedback-unhelpful"
        size="small"
      >
        👎
      </IconButton>
      {summary && (
        <Typography variant="caption" color="text.secondary">
          {summary.helpful} / {summary.unhelpful}
        </Typography>
      )}
    </Box>
  );
};

export default KbFeedbackBar;
