/**
 * RTK Query endpoints for product scoping canvas.
 * @module store/api/scopingApi
 */
import { baseApi } from './baseApi';
import type {
  ScopedFeature,
  ScopedFeatureFormData,
} from '@/types/scoping';
import apiConstants from '@/constants/api.json';

/** Input for updating a feature (includes id). */
type UpdateFeatureInput =
  ScopedFeatureFormData & { id: string };

/** Scoping CRUD endpoints injected into baseApi. */
export const scopingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch all scoped features for the user,
     * sorted by ICE score descending.
     * @returns Array of ScopedFeature entries.
     */
    listFeatures: build.query<ScopedFeature[], void>({
      query: () => apiConstants.scoping.features,
      providesTags: ['Scoping'],
    }),

    /**
     * Create a new scoped feature.
     * @param data - Feature fields.
     */
    createFeature: build.mutation<
      ScopedFeature,
      ScopedFeatureFormData
    >({
      query: (data) => ({
        url: apiConstants.scoping.features,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Scoping'],
    }),

    /**
     * Update an existing scoped feature.
     * @param input - Updated fields including id.
     */
    updateFeature: build.mutation<
      ScopedFeature,
      UpdateFeatureInput
    >({
      query: ({ id, ...body }) => ({
        url: apiConstants.scoping.feature.replace(
          ':id',
          id,
        ),
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Scoping'],
    }),

    /**
     * Delete a scoped feature by id.
     * @param id - Feature identifier.
     */
    deleteFeature: build.mutation<void, string>({
      query: (id) => ({
        url: apiConstants.scoping.feature.replace(
          ':id',
          id,
        ),
        method: 'DELETE',
      }),
      invalidatesTags: ['Scoping'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = scopingApi;
