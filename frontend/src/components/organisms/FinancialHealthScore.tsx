'use client';

/**
 * Financial health score display organism.
 * @module components/organisms/FinancialHealthScore
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslations } from 'next-intl';
import type { HealthScore } from '@/types/financials';

/** Props for FinancialHealthScore. */
export interface FinancialHealthScoreProps {
  /** The computed health score object. */
  health: HealthScore;
}

const scoreColor = (score: number): string => {
  if (score >= 70) return '#2e7d32';
  if (score >= 40) return '#ed6c02';
  return '#d32f2f';
};

/** A single labelled progress bar (internal). */
const ScoreBar: React.FC<{
  label: string;
  value: number;
  testId: string;
}> = ({ label, value, testId }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      {label}: {value}
    </Typography>
    <LinearProgress variant="determinate" value={value}
      aria-label={`${label} score`}
      data-testid={testId}
      sx={{ height: 8, borderRadius: 4,
        '& .MuiLinearProgress-bar': {
          backgroundColor: scoreColor(value),
        } }}
    />
  </Box>
);

/**
 * Displays overall health score with four sub-scores.
 * @param props - FinancialHealthScoreProps.
 * @returns FinancialHealthScore UI.
 */
export const FinancialHealthScore: React.FC<
  FinancialHealthScoreProps
> = ({ health }) => {
  const t = useTranslations('financials');
  const color = scoreColor(health.score);
  return (
    <Box data-testid="financial-health-score"
      aria-label={t('health.title')}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h2"
          sx={{ color, fontWeight: 800 }}>
          {health.score}
        </Typography>
        <Typography variant="h6" sx={{ color }}>
          {health.label === 'Healthy'
            ? t('health.healthy')
            : health.label === 'Caution'
              ? t('health.caution')
              : t('health.atRisk')}
        </Typography>
      </Box>
      <ScoreBar label="Runway"
        value={health.runway_score}
        testId="health-bar-runway" />
      <ScoreBar label="LTV:CAC"
        value={health.ltv_cac_score}
        testId="health-bar-ltvcac" />
      <ScoreBar label="Churn"
        value={health.churn_score}
        testId="health-bar-churn" />
      <ScoreBar label="MRR"
        value={health.mrr_score}
        testId="health-bar-mrr" />
    </Box>
  );
};

export default FinancialHealthScore;
