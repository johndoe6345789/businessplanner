/**
 * Market Research Persona RTK Query endpoints.
 * @module store/api/marketResearchPersonaApi
 */
import { baseApi } from './baseApi';
import type {
  Persona,
  CreatePersonaInput,
} from '@/types/marketResearch';
import apiConstants from '@/constants/api.json';

/** Args for update persona endpoint. */
export interface UpdatePersonaArgs {
  /** Persona record ID. */
  id: string;
  /** Fields to update. */
  data: Partial<CreatePersonaInput>;
}

/** Persona endpoints injected into baseApi. */
export const marketResearchPersonaApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * List all personas for the current user.
       */
      listPersonas: build.query<Persona[], void>({
        query: () =>
          apiConstants.marketResearch.personas,
        providesTags: ['MarketResearch'],
      }),

      /**
       * Create a new persona.
       * @param data - Persona creation payload.
       */
      createPersona: build.mutation<
        Persona,
        CreatePersonaInput
      >({
        query: (data) => ({
          url: apiConstants.marketResearch.personas,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['MarketResearch'],
      }),

      /**
       * Update an existing persona.
       * @param args - ID and update payload.
       */
      updatePersona: build.mutation<
        Persona,
        UpdatePersonaArgs
      >({
        query: ({ id, data }) => ({
          url: apiConstants.marketResearch.persona
            .replace(':id', id),
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['MarketResearch'],
      }),

      /**
       * Delete a persona by ID.
       * @param id - Persona record ID.
       */
      deletePersona: build.mutation<void, string>({
        query: (id) => ({
          url: apiConstants.marketResearch.persona
            .replace(':id', id),
          method: 'DELETE',
        }),
        invalidatesTags: ['MarketResearch'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListPersonasQuery,
  useCreatePersonaMutation,
  useUpdatePersonaMutation,
  useDeletePersonaMutation,
} = marketResearchPersonaApi;
