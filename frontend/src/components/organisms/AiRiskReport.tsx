'use client';

/**
 * AI-powered risk report for the founder's plan.
 * @module components/organisms/AiRiskReport
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Alert from '@shared/m3/Alert';
import Typography from '@shared/m3/Typography';
import CircularProgress
  from '@shared/m3/CircularProgress';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import {
  useGetRiskReportMutation,
} from '@/store/api/aiApi';

/**
 * Displays a "Generate Risk Report" button,
 * loading indicator, and the resulting risk list.
 */
export const AiRiskReport: React.FC = () => {
  const t = useTranslations('riskReport');
  const completedSteps = useSelector(
    (s: RootState) =>
      Object.keys(s.planner.completedSteps).filter(
        (id) => s.planner.completedSteps[id],
      ),
  );
  const startupType = useSelector(
    (s: RootState) => s.startupType.selectedSlug,
  );
  const stage = useSelector(
    (s: RootState) => s.startupType.selectedStage,
  );

  const [generate, { data, isLoading }] =
    useGetRiskReportMutation();

  const handleGenerate = () => {
    void generate({
      startup_type: startupType,
      stage,
      planner_completed_steps: completedSteps,
    });
  };

  return (
    <Box
      data-testid="ai-risk-report"
      aria-label={t('title')}
      sx={{ maxWidth: 680 }}
    >
      <Button
        variant="contained"
        onClick={handleGenerate}
        disabled={isLoading}
        aria-label={
          isLoading ? t('generating') : t('generate')
        }
        startIcon={
          isLoading
            ? <CircularProgress size={16} />
            : null
        }
        sx={{ mb: 2 }}
      >
        {isLoading ? t('generating') : t('generate')}
      </Button>

      {data && (
        <Alert
          severity="warning"
          aria-live="polite"
          sx={{ whiteSpace: 'pre-wrap' }}
        >
          {data.risks || t('noRisks')}
        </Alert>
      )}
    </Box>
  );
};

export default AiRiskReport;
