'use client';

/**
 * Per-step AI tip card.
 * @module components/molecules/AiSuggestionCard
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import LinearProgress
  from '@shared/m3/LinearProgress';
import { useTranslations } from 'next-intl';
import { useAiSuggestion }
  from '@/hooks/useAiSuggestion';
import AiSuggestionResult
  from './AiSuggestionResult';

/** Props for AiSuggestionCard. */
export interface AiSuggestionCardProps {
  /** Roadmap step identifier. */
  stepId: string;
  /** Human-readable step title. */
  stepTitle: string;
}

/**
 * Compact AI tip widget rendered below each planner step.
 * Shows a "Get AI Tip" button; on click fetches and
 * displays a contextual suggestion. Dismissible.
 */
export const AiSuggestionCard: React.FC<
  AiSuggestionCardProps
> = ({ stepId, stepTitle }) => {
  const t = useTranslations('ai');
  const {
    suggestion, isLoading, error,
    fetchSuggestion, dismiss,
  } = useAiSuggestion();

  if (isLoading) {
    return (
      <Box
        sx={{ mt: 0.5, px: 1 }}
        data-testid={`ai-suggestion-${stepId}`}
        aria-label={t('loading')}
      >
        <LinearProgress
          aria-label={t('loading')}
          sx={{ height: 2, borderRadius: 1 }}
        />
      </Box>
    );
  }

  if (error || suggestion) {
    return (
      <AiSuggestionResult
        stepId={stepId}
        suggestion={suggestion}
        error={error}
        onDismiss={dismiss}
      />
    );
  }

  return (
    <Box sx={{ mt: 0.25 }}>
      <Button
        size="small"
        variant="text"
        onClick={() =>
          fetchSuggestion(stepId, stepTitle)
        }
        data-testid={`ai-suggestion-${stepId}`}
        aria-label={t('getAiTip')}
        sx={{ fontSize: '0.7rem', py: 0 }}
      >
        {t('getAiTip')}
      </Button>
    </Box>
  );
};

export default AiSuggestionCard;
