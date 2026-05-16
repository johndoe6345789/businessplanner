/**
 * RTK Query endpoints for the OKR domain.
 * @module store/api/okrApi
 */
import { baseApi } from './baseApi';
import type {
  OkrObjective,
  KeyResult,
  CreateOkrObjectiveInput,
  AddKeyResultInput,
  UpdateKeyResultInput,
} from '@/types/okr';
import apiConstants from '@/constants/api.json';

const OBJ = apiConstants.okr.objectives;
const KR = apiConstants.okr.keyResultById.replace('/:id', '');

/** OKR API endpoints. */
export const okrApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List all OKR objectives (with key results) for
     * the current user, filtered by quarter/year.
     * @param args - quarter and year filter.
     */
    listOkrObjectives: build.query<
      OkrObjective[],
      { quarter: number; year: number }
    >({
      query: ({ quarter, year }) =>
        `${OBJ}?quarter=${quarter}&year=${year}`,
      providesTags: ['Okr'],
    }),

    /**
     * Create a new OKR objective.
     * @param input - Objective fields.
     */
    createOkrObjective: build.mutation<
      OkrObjective, CreateOkrObjectiveInput
    >({
      query: (body) => ({
        url: OBJ, method: 'POST', body }),
      invalidatesTags: ['Okr'],
    }),

    /**
     * Delete an OKR objective by ID.
     * @param id - UUID of the objective.
     */
    deleteOkrObjective: build.mutation<void, string>({
      query: (id) => ({
        url: `${OBJ}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Okr'],
    }),

    /**
     * Add a key result to an objective.
     * @param args - Objective ID and KR fields.
     */
    addKeyResult: build.mutation<
      KeyResult,
      { objectiveId: string } & AddKeyResultInput
    >({
      query: ({ objectiveId, ...body }) => ({
        url: `${OBJ}/${objectiveId}/key-results`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Okr'],
    }),

    /**
     * Update the current value of a key result.
     * @param args - KR ID and new current_value.
     */
    updateKeyResult: build.mutation<
      KeyResult,
      { id: string } & UpdateKeyResultInput
    >({
      query: ({ id, ...body }) => ({
        url: `${KR}/${id}/value`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Okr'],
    }),

    /**
     * Delete a key result by ID.
     * @param id - UUID of the key result.
     */
    deleteKeyResult: build.mutation<void, string>({
      query: (id) => ({
        url: `${KR}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Okr'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListOkrObjectivesQuery,
  useCreateOkrObjectiveMutation,
  useDeleteOkrObjectiveMutation,
  useAddKeyResultMutation,
  useUpdateKeyResultMutation,
  useDeleteKeyResultMutation,
} = okrApi;
