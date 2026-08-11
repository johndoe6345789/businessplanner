'use client';

/**
 * Compact list of past weekly reviews.
 * @module components/organisms/WeeklyReviewHistory
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ExpandMoreIcon,
} from '@shared/m3/surfaces';
import { useTranslations } from 'next-intl';
import { useListReviewsQuery } from
  '@/store/api/weeklyReviewApi';

/** Emoji map for morale scores 1–5. */
const MORALE_EMOJI: Record<number, string> = {
  1: '😞', 2: '😐', 3: '😊', 4: '😄', 5: '🚀',
};

/**
 * Accordion list of past reviews (up to 12 weeks).
 * Morale shown as emoji; fields expand on click.
 *
 * @returns WeeklyReviewHistory UI.
 */
export const WeeklyReviewHistory: React.FC = () => {
  const t = useTranslations('review');
  const { data: reviews = [] } = useListReviewsQuery();

  return (
    <Box
      data-testid="weekly-review-history"
      aria-label={t('historyTitle')}>
      <Typography variant="h6" gutterBottom>
        {t('historyTitle')}
      </Typography>
      {reviews.length === 0 && (
        <Typography color="text.secondary">
          {t('noHistory')}
        </Typography>
      )}
      {reviews.map((r) => (
        <Accordion
          key={r.id}
          data-testid={`review-item-${r.id}`}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`review-${r.id}-content`}
            id={`review-${r.id}-header`}>
            <Typography sx={{ flexGrow: 1 }}>
              {t('weekOf')} {r.week_start}
            </Typography>
            <Typography
              aria-label={t('morale')}
              sx={{ mr: 2 }}>
              {MORALE_EMOJI[r.morale] ?? '😊'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2">
              {t('wins')}
            </Typography>
            <Typography
              variant="body2" sx={{ mb: 1 }}>
              {r.wins || '—'}
            </Typography>
            <Typography variant="subtitle2">
              {t('challenges')}
            </Typography>
            <Typography
              variant="body2" sx={{ mb: 1 }}>
              {r.challenges || '—'}
            </Typography>
            <Typography variant="subtitle2">
              {t('nextGoals')}
            </Typography>
            <Typography variant="body2">
              {r.next_goals || '—'}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default WeeklyReviewHistory;
