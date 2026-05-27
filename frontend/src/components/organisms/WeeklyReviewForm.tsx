'use client';

/** @module components/organisms/WeeklyReviewForm */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import Typography from '@shared/m3/Typography';
import Alert from '@mui/material/Alert';
import Slider from '@mui/material/Slider';
import { useTranslations } from 'next-intl';
import { useWeeklyReview } from
  '@/hooks/useWeeklyReview';
import { useWeeklyReviewFormState }
  from '@/hooks/useWeeklyReviewFormState';

/**
 * Structured weekly reflection form.
 * Pre-fills with the current week's review if saved.
 * On submit fires completeStep to maintain streak.
 *
 * @returns WeeklyReviewForm UI.
 */
const WeeklyReviewForm: React.FC = () => {
  const t = useTranslations('review');
  const tc = useTranslations('common');
  const { thisWeek, submitReview, isSubmitting } =
    useWeeklyReview();
  const vm = useWeeklyReviewFormState(
    thisWeek, submitReview,
  );

  return (
    <Box component="form"
      data-testid="weekly-review-form"
      aria-label={t('title')}
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
      {vm.saved && (
        <Alert severity="success">{t('saved')}</Alert>
      )}
      <TextField label={t('wins')} multiline
        minRows={3} value={vm.wins}
        onChange={(e) => vm.setWins(e.target.value)}
        inputProps={{ 'aria-label': t('wins') }}
        data-testid="review-wins" />
      <TextField label={t('challenges')} multiline
        minRows={3} value={vm.challenges}
        onChange={(e) =>
          vm.setChallenges(e.target.value)}
        inputProps={{ 'aria-label': t('challenges') }}
        data-testid="review-challenges" />
      <TextField label={t('nextGoals')} multiline
        minRows={3} value={vm.nextGoals}
        onChange={(e) =>
          vm.setNextGoals(e.target.value)}
        inputProps={{ 'aria-label': t('nextGoals') }}
        data-testid="review-next-goals" />
      <Box>
        <Typography gutterBottom>
          {t('morale')}: {vm.morale}
        </Typography>
        <Slider min={1} max={5} step={1} marks
          value={vm.morale}
          onChange={(_, v) =>
            vm.setMorale(v as number)}
          aria-label={t('morale')}
          aria-valuemin={1} aria-valuemax={5}
          data-testid="review-morale" />
      </Box>
      <Button variant="contained"
        onClick={() => void vm.handleSubmit()}
        disabled={isSubmitting}
        aria-label={t('save')}
        data-testid="review-save-btn">
        {isSubmitting ? tc('loading') : t('save')}
      </Button>
    </Box>
  );
};
export { WeeklyReviewForm };
export default WeeklyReviewForm;
