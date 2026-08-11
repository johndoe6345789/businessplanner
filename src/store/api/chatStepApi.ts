/**
 * RTK Query endpoints for chat-step links.
 * @module store/api/chatStepApi
 */
import { baseApi } from './baseApi';
import apiConstants from '@/constants/api.json';

/** Saved context for a planner step. */
export interface StepContext {
  /** AI-generated context text. */
  context: string;
  /** ISO timestamp of when it was saved. */
  created_at?: string;
}

/** Body for saving step context. */
export interface SaveStepContextBody {
  /** Planner step identifier. */
  step_id: string;
  /** AI suggestion text to save. */
  context: string;
}

/** Chat-step link API endpoints. */
export const chatStepApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch saved AI context for a planner step.
     * @param stepId - The planner step ID.
     */
    getStepContext: build.query<
      StepContext,
      string
    >({
      query: (stepId) =>
        apiConstants.ai.stepLink.replace(
          ':step_id',
          stepId,
        ),
      providesTags: ['ChatStepLinks'],
    }),

    /**
     * Persist AI context for a planner step.
     * @param body - step_id + context text.
     */
    saveStepContext: build.mutation<
      { ok: boolean },
      SaveStepContextBody
    >({
      query: (body) => ({
        url: apiConstants.ai.stepLinks,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ChatStepLinks'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStepContextQuery,
  useSaveStepContextMutation,
} = chatStepApi;
