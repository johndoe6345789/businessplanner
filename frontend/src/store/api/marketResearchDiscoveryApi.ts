/**
 * Market Research Discovery Log RTK Query endpoints.
 * @module store/api/marketResearchDiscoveryApi
 */
import { baseApi } from './baseApi';
import type {
  DiscoveryEntry,
  CreateDiscoveryInput,
} from '@/types/marketResearch';
import apiConstants from '@/constants/api.json';

/** Discovery endpoints injected into baseApi. */
export const marketResearchDiscoveryApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * List all discovery entries for the current user.
       */
      listDiscovery: build.query<
        DiscoveryEntry[], void
      >({
        query: () =>
          apiConstants.marketResearch.discovery,
        providesTags: ['MarketResearch'],
      }),

      /**
       * Create a new discovery log entry.
       * @param data - Discovery entry payload.
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
      deleteDiscoveryEntry: build.mutation<
        void, string
      >({
        query: (id) => ({
          url: apiConstants.marketResearch
            .discoveryEntry.replace(':id', id),
          method: 'DELETE',
        }),
        invalidatesTags: ['MarketResearch'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListDiscoveryQuery,
  useCreateDiscoveryEntryMutation,
  useDeleteDiscoveryEntryMutation,
} = marketResearchDiscoveryApi;
