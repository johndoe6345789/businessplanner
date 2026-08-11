/**
 * RTK Query endpoints for the accelerator tracker.
 * @module store/api/acceleratorsApi
 */
import { baseApi } from './baseApi';
import type {
  Accelerator,
  AcceleratorFormData,
} from '@/types/accelerators';
import apiConstants from '@/constants/api.json';

/** Input for updating a record (includes id). */
type UpdateAcceleratorInput =
  AcceleratorFormData & { id: string };

/** Accelerator CRUD endpoints injected into baseApi. */
export const acceleratorsApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * Fetch all programmes for the current user.
       * @returns Array of Accelerator entries.
       */
      listAccelerators: build.query<
        Accelerator[],
        void
      >({
        query: () => ({
          url: apiConstants.accelerators.list,
        }),
        providesTags: ['Accelerators'],
      }),

      /**
       * Create a new programme record.
       * @param data - Accelerator form data.
       */
      createAccelerator: build.mutation<
        Accelerator,
        AcceleratorFormData
      >({
        query: (data) => ({
          url: apiConstants.accelerators.list,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Accelerators'],
      }),

      /**
       * Update an existing programme record.
       * @param input - Updated fields including id.
       */
      updateAccelerator: build.mutation<
        Accelerator,
        UpdateAcceleratorInput
      >({
        query: ({ id, ...body }) => ({
          url: apiConstants.accelerators.detail
            .replace(':id', id),
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['Accelerators'],
      }),

      /**
       * Delete a programme record by id.
       * @param id - Accelerator identifier.
       */
      deleteAccelerator: build.mutation<
        void,
        string
      >({
        query: (id) => ({
          url: apiConstants.accelerators.detail
            .replace(':id', id),
          method: 'DELETE',
        }),
        invalidatesTags: ['Accelerators'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListAcceleratorsQuery,
  useCreateAcceleratorMutation,
  useUpdateAcceleratorMutation,
  useDeleteAcceleratorMutation,
} = acceleratorsApi;
