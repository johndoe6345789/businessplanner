'use client';

/**
 * Per-step AI suggestion hook.
 * @module hooks/useAiSuggestion
 */
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  useGetAiStepSuggestionMutation,
} from '@/store/api/aiApi';

/** Return type for useAiSuggestion. */
export interface UseAiSuggestionReturn {
  /** Cached suggestion text, or undefined. */
  suggestion: string | undefined;
  /** True while the API call is in-flight. */
  isLoading: boolean;
  /** True when the last call resulted in an error. */
  error: boolean;
  /** Fetch a suggestion for the given step. */
  fetchSuggestion: (
    stepId: string,
    stepTitle: string,
  ) => void;
  /** Clear the current suggestion. */
  dismiss: () => void;
}

/**
 * Manages per-step AI tip fetching and local cache.
 * @returns Suggestion state and fetch/dismiss actions.
 */
export function useAiSuggestion(): UseAiSuggestionReturn {
  const selectedSlug = useAppSelector(
    (s) => s.startupType.selectedSlug,
  );
  const selectedStage = useAppSelector(
    (s) => s.startupType.selectedStage,
  );

  const [suggestion, setSuggestion] =
    useState<string | undefined>(undefined);
  const [error, setError] = useState(false);

  const [getAiStepSuggestion, { isLoading }] =
    useGetAiStepSuggestionMutation();

  const fetchSuggestion = (
    _stepId: string,
    stepTitle: string,
  ) => {
    setError(false);
    setSuggestion(undefined);
    getAiStepSuggestion({
      step_title: stepTitle,
      startup_type: selectedSlug,
      stage: selectedStage,
    })
      .unwrap()
      .then((res) => { setSuggestion(res.suggestion); })
      .catch(() => { setError(true); });
  };

  const dismiss = () => {
    setSuggestion(undefined);
    setError(false);
  };

  return {
    suggestion,
    isLoading,
    error,
    fetchSuggestion,
    dismiss,
  };
}
