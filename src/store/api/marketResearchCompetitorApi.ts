/**
 * Market Research Competitor RTK Query endpoints.
 * @module store/api/marketResearchCompetitorApi
 */
import { baseApi } from './baseApi';
import type {
  Competitor,
  CreateCompetitorInput,
} from '@/types/marketResearch';
import apiConstants from '@/constants/api.json';

/** Args for update competitor endpoint. */
export interface UpdateCompetitorArgs {
  /** Competitor record ID. */
  id: string;
  /** Fields to update. */
  data: Partial<CreateCompetitorInput>;
}

/** Competitor endpoints injected into baseApi. */
export const marketResearchCompetitorApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * List all competitors for the current user.
       */
      listCompetitors: build.query<Competitor[], void>({
        query: () => apiConstants.marketResearch.competitors,
        providesTags: ['MarketResearch'],
      }),

      /**
       * Create a new competitor entry.
       * @param data - Competitor creation payload.
       */
      createCompetitor: build.mutation<
        Competitor,
        CreateCompetitorInput
      >({
        query: (data) => ({
          url: apiConstants.marketResearch.competitors,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['MarketResearch'],
      }),

      /**
       * Update an existing competitor entry.
       * @param args - ID and update payload.
       */
      updateCompetitor: build.mutation<
        Competitor,
        UpdateCompetitorArgs
      >({
        query: ({ id, data }) => ({
          url: apiConstants.marketResearch.competitor
            .replace(':id', id),
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: ['MarketResearch'],
      }),

      /**
       * Delete a competitor by ID.
       * @param id - Competitor record ID.
       */
      deleteCompetitor: build.mutation<void, string>({
        query: (id) => ({
          url: apiConstants.marketResearch.competitor
            .replace(':id', id),
          method: 'DELETE',
        }),
        invalidatesTags: ['MarketResearch'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListCompetitorsQuery,
  useCreateCompetitorMutation,
  useUpdateCompetitorMutation,
  useDeleteCompetitorMutation,
} = marketResearchCompetitorApi;
