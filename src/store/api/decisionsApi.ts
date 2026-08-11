/**
 * RTK Query endpoints for the decision log.
 * @module store/api/decisionsApi
 */
import { baseApi } from './baseApi';
import type {
  Decision,
  DecisionFormData,
} from '@/types/decisions';
import apiConstants from '@/constants/api.json';

/** Input for updating a decision (includes id). */
type UpdateDecisionInput =
  DecisionFormData & { id: string };

/** Decision CRUD endpoints injected into baseApi. */
export const decisionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch all decisions, optionally filtered.
     * @param search - Optional search term.
     * @returns Array of Decision entries.
     */
    listDecisions: build.query<
      Decision[],
      { search?: string }
    >({
      query: ({ search } = {}) => ({
        url: apiConstants.decisions.list,
        params: search ? { search } : undefined,
      }),
      providesTags: ['Decisions'],
    }),

    /**
     * Create a new decision.
     * @param data - Decision form data.
     */
    createDecision: build.mutation<
      Decision,
      DecisionFormData
    >({
      query: (data) => ({
        url: apiConstants.decisions.list,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Decisions'],
    }),

    /**
     * Update an existing decision.
     * @param input - Updated fields including id.
     */
    updateDecision: build.mutation<
      Decision,
      UpdateDecisionInput
    >({
      query: ({ id, ...body }) => ({
        url: apiConstants.decisions.detail.replace(
          ':id',
          id,
        ),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Decisions'],
    }),

    /**
     * Delete a decision by id.
     * @param id - Decision identifier.
     */
    deleteDecision: build.mutation<void, string>({
      query: (id) => ({
        url: apiConstants.decisions.detail.replace(
          ':id',
          id,
        ),
        method: 'DELETE',
      }),
      invalidatesTags: ['Decisions'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListDecisionsQuery,
  useCreateDecisionMutation,
  useUpdateDecisionMutation,
  useDeleteDecisionMutation,
} = decisionsApi;
