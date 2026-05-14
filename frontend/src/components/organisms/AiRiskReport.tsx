'use client';

/**
 * AI-powered risk report for the founder's plan.
 * @module components/organisms/AiRiskReport
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import CircularProgress
  from '@shared/m3/CircularProgress';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useGetRiskReportMutation }
  from '@/store/api/aiApi';
import { AiRiskResult }
  from '@/components/molecules/AiRiskResult';
import { AiErrorCard }
  from '@/components/atoms/AiErrorCard';

/**
 * Displays a "Generate Risk Report" button,
 * loading indicator, error state, and results.
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

  const [generate, { data, isLoading, isError }] =
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
      {!data && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          {t('hint')}
        </Typography>
      )}

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

      {isError && (
        <AiErrorCard message={t('generateError')} />
      )}

      {data && (
        <AiRiskResult
          risks={data.risks || t('noRisks')}
          generatedAt={data.generated_at}
        />
      )}
    </Box>
  );
};

export default AiRiskReport;
