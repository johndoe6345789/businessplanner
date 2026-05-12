/**
 * AI step-suggestion RTK Query endpoints.
 * @module store/api/aiApi
 */
import { baseApi } from './baseApi';
import apiConstants from '@/constants/api.json';

/** Body for the step-suggestion mutation. */
export interface StepSuggestionBody {
  /** Human-readable title of the planner step. */
  step_title: string;
  /** Optional longer description of the step. */
  step_description?: string;
  /** Startup archetype slug from Redux. */
  startup_type?: string | null;
  /** Current stage slug from Redux. */
  stage?: string | null;
}

/** Response from the step-suggestion endpoint. */
export interface StepSuggestionResponse {
  /** AI-generated suggestion text. */
  suggestion: string;
}

/** AI API endpoints injected into baseApi. */
export const aiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch an AI tip for a single planner step.
     * @returns Contextual suggestion text.
     */
    getAiStepSuggestion: build.mutation<
      StepSuggestionResponse,
      StepSuggestionBody
    >({
      query: (body) => ({
        url: apiConstants.ai.stepSuggestion,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiStepSuggestionMutation,
} = aiApi;
