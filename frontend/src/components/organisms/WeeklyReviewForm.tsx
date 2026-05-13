'use client';

/** @module components/organisms/WeeklyReviewForm */
import React, { useState, useEffect } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import TextField from '@shared/m3/TextField';
import Typography from '@shared/m3/Typography';
import Alert from '@mui/material/Alert';
import Slider from '@mui/material/Slider';
import { useTranslations } from 'next-intl';
import { useWeeklyReview } from
  '@/hooks/useWeeklyReview';

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
  const {
    thisWeek, submitReview, isSubmitting,
  } = useWeeklyReview();
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextGoals, setNextGoals] = useState('');
  const [morale, setMorale] = useState(3);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!thisWeek) return;
    setWins(thisWeek.wins);
    setChallenges(thisWeek.challenges);
    setNextGoals(thisWeek.next_goals);
    setMorale(thisWeek.morale);
  }, [thisWeek]);

  const handleSubmit = async () => {
    await submitReview({
      week_start: thisWeek?.week_start ?? '',
      wins, challenges,
      next_goals: nextGoals,
      morale: morale as 1 | 2 | 3 | 4 | 5,
    });
    setSaved(true);
  };

  return (
    <Box component="form"
      data-testid="weekly-review-form"
      aria-label={t('title')}
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 2 }}>
      {saved && (
        <Alert severity="success">
          {t('saved')}
        </Alert>
      )}
      <TextField label={t('wins')} multiline
        minRows={3} value={wins}
        onChange={(e) => setWins(e.target.value)}
        inputProps={{ 'aria-label': t('wins') }}
        data-testid="review-wins" />
      <TextField label={t('challenges')} multiline
        minRows={3} value={challenges}
        onChange={(e) => setChallenges(e.target.value)}
        inputProps={{ 'aria-label': t('challenges') }}
        data-testid="review-challenges" />
      <TextField label={t('nextGoals')} multiline
        minRows={3} value={nextGoals}
        onChange={(e) => setNextGoals(e.target.value)}
        inputProps={{ 'aria-label': t('nextGoals') }}
        data-testid="review-next-goals" />
      <Box>
        <Typography gutterBottom>
          {t('morale')}: {morale}
        </Typography>
        <Slider min={1} max={5} step={1} marks
          value={morale}
          onChange={(_, v) =>
            setMorale(v as number)}
          aria-label={t('morale')}
          aria-valuemin={1}
          aria-valuemax={5}
          data-testid="review-morale" />
      </Box>
      <Button variant="contained"
        onClick={handleSubmit}
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
