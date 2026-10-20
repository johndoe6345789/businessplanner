'use client';

/**
 * Displays the AI suggestion result or error state.
 * @module components/molecules/AiSuggestionResult
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Alert from '@shared/m3/Alert';
import { useTranslations } from 'next-intl';
import { SaveChatToStepButton }
  from './SaveChatToStepButton';

/** Props for AiSuggestionResult. */
interface AiSuggestionResultProps {
  /** Step identifier (for testid). */
  stepId: string;
  /** Suggestion text, or undefined. */
  suggestion: string | undefined;
  /** Whether the request failed. */
  error: boolean;
  /** Called to dismiss the result. */
  onDismiss: () => void;
}

/**
 * Renders the AI suggestion or error alert with
 * optional save-to-step action.
 */
const AiSuggestionResult: React.FC<
  AiSuggestionResultProps
> = ({ stepId, suggestion, error, onDismiss }) => {
  const t = useTranslations('ai');
  const severity = error ? 'warning' : 'info';
  const text = error
    ? t('unavailable')
    : (suggestion ?? '');
  return (
    <Alert
      severity={severity}
      data-testid={`ai-suggestion-${stepId}`}
      action={
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {!error && suggestion && (
            <SaveChatToStepButton
              stepId={stepId}
              context={suggestion}
            />
          )}
          <Button
            size="small"
            onClick={onDismiss}
            aria-label={t('dismiss')}
          >
            {t('dismiss')}
          </Button>
        </Box>
      }
      sx={{ mt: 0.5, py: 0.25 }}
    >
      {text}
    </Alert>
  );
};

export default AiSuggestionResult;
