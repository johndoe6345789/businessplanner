/**
 * RTK Query endpoints for the PDCA cycle domain.
 * @module store/api/pdcaApi
 */
import { baseApi } from './baseApi';
import type {
  PdcaCycle,
  CreatePdcaInput,
  UpdatePdcaPhaseInput,
} from '@/types/pdca';
import apiConstants from '@/constants/api.json';

const C = apiConstants.pdca.cycles;

/** PDCA cycle API endpoints. */
export const pdcaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List all PDCA cycles for the current user.
     * @returns Array of PdcaCycle.
     */
    listPdcaCycles: build.query<PdcaCycle[], void>({
      query: () => C,
      providesTags: ['Pdca'],
    }),

    /**
     * Create a new PDCA cycle.
     * @param input - Cycle title and description.
     * @returns The created PdcaCycle.
     */
    createPdcaCycle: build.mutation<
      PdcaCycle, CreatePdcaInput
    >({
      query: (body) => ({ url: C, method: 'POST', body }),
      invalidatesTags: ['Pdca'],
    }),

    /**
     * Update a PDCA phase (advance or add notes).
     * @param args - Cycle ID and phase payload.
     * @returns The updated PdcaCycle.
     */
    updatePdcaPhase: build.mutation<
      PdcaCycle,
      { id: string } & UpdatePdcaPhaseInput
    >({
      query: ({ id, ...body }) => ({
        url: `${C}/${id}/phase`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Pdca'],
    }),

    /**
     * Delete a PDCA cycle by ID.
     * @param id - UUID of the cycle.
     */
    deletePdcaCycle: build.mutation<void, string>({
      query: (id) => ({
        url: `${C}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pdca'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListPdcaCyclesQuery,
  useCreatePdcaCycleMutation,
  useUpdatePdcaPhaseMutation,
  useDeletePdcaCycleMutation,
} = pdcaApi;
