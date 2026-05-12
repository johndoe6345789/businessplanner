/**
 * Market Research Persona & Discovery RTK Query endpoints.
 * @module store/api/marketResearchPersonaApi
 */
import { baseApi } from './baseApi';
import type {
  Persona,
  CreatePersonaInput,
  DiscoveryEntry,
  CreateDiscoveryInput,
} from '@/types/marketResearch';
import apiConstants from '@/constants/api.json';

/** Args for update persona endpoint. */
export interface UpdatePersonaArgs {
  /** Persona record ID. */
  id: string;
  /** Fields to update. */
  data: Partial<CreatePersonaInput>;
}

/** Persona and Discovery endpoints injected into baseApi. */
export const marketResearchPersonaApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * List all personas for the current user.
       */
      listPersonas: build.query<Persona[], void>({
        query: () => apiConstants.marketResearch.personas,
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

      /**
       * List all discovery log entries for the current user.
       */
      listDiscovery: build.query<DiscoveryEntry[], void>({
        query: () => apiConstants.marketResearch.discovery,
        providesTags: ['MarketResearch'],
      }),

      /**
       * Create a new discovery log entry.
       * @param data - Discovery entry creation payload.
       */
      createDiscoveryEntry: build.mutation<
        DiscoveryEntry,
        CreateDiscoveryInput
      >({
        query: (data) => ({
          url: apiConstants.marketResearch.discovery,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['MarketResearch'],
      }),

      /**
       * Delete a discovery entry by ID.
       * @param id - Discovery entry record ID.
       */
      deleteDiscoveryEntry: build.mutation<void, string>({
        query: (id) => ({
          url: apiConstants.marketResearch.discoveryEntry
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
  useListDiscoveryQuery,
  useCreateDiscoveryEntryMutation,
  useDeleteDiscoveryEntryMutation,
} = marketResearchPersonaApi;
