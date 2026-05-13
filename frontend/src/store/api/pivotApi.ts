/**
 * RTK Query endpoints for the pivot tracker.
 * @module store/api/pivotApi
 */
import { baseApi } from './baseApi';
import type { Pivot, PivotFormData } from '@/types/pivot';
import apiConstants from '@/constants/api.json';

/** Input for updating a pivot (includes id). */
type UpdatePivotInput =
  PivotFormData & { id: string };

/** Pivot CRUD endpoints injected into baseApi. */
export const pivotApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch all pivots for the current user.
     * @returns Array of Pivot entries.
     */
    listPivots: build.query<Pivot[], void>({
      query: () => ({
        url: apiConstants.pivots.list,
      }),
      providesTags: ['Pivots'],
    }),

    /**
     * Create a new pivot record.
     * @param data - Pivot form data.
     */
    createPivot: build.mutation<
      Pivot,
      PivotFormData
    >({
      query: (data) => ({
        url: apiConstants.pivots.list,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pivots'],
    }),

    /**
     * Update an existing pivot.
     * @param input - Updated fields including id.
     */
    updatePivot: build.mutation<
      Pivot,
      UpdatePivotInput
    >({
      query: ({ id, ...body }) => ({
        url: apiConstants.pivots.detail.replace(
          ':id',
          id,
        ),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Pivots'],
    }),

    /**
     * Delete a pivot by id.
     * @param id - Pivot identifier.
     */
    deletePivot: build.mutation<void, string>({
      query: (id) => ({
        url: apiConstants.pivots.detail.replace(
          ':id',
          id,
        ),
        method: 'DELETE',
      }),
      invalidatesTags: ['Pivots'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListPivotsQuery,
  useCreatePivotMutation,
  useUpdatePivotMutation,
  useDeletePivotMutation,
} = pivotApi;
