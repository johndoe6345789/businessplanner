/**
 * RTK Query endpoints for OKR key results.
 * @module store/api/okrKeyResultsApi
 */
import { baseApi } from './baseApi';
import type {
  KeyResult,
  AddKeyResultInput,
  UpdateKeyResultInput,
} from '@/types/okr';
import apiConstants from '@/constants/api.json';

const OBJ = apiConstants.okr.objectives;
const KR = apiConstants.okr.keyResultById.replace('/:id', '');

/** OKR key results API endpoints. */
export const okrKeyResultsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  useAddKeyResultMutation,
  useUpdateKeyResultMutation,
  useDeleteKeyResultMutation,
} = okrKeyResultsApi;
