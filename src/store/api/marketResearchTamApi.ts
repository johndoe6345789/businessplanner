/**
 * Market Research TAM/SAM/SOM RTK Query endpoints.
 * @module store/api/marketResearchTamApi
 */
import { baseApi } from './baseApi';
import type {
  TamInputs,
} from '@/types/marketResearch';
import apiConstants from '@/constants/api.json';

/** Market Research TAM endpoints injected into baseApi. */
export const marketResearchTamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch previously saved TAM inputs for the user.
     * @returns Saved TamInputs or default empty state.
     */
    getTam: build.query<TamInputs, void>({
      query: () => apiConstants.marketResearch.tam,
      providesTags: ['MarketResearch'],
    }),

    /**
     * Persist TAM inputs for the current user.
     * @param inputs - TamInputs to save.
     */
    saveTam: build.mutation<TamInputs, TamInputs>({
      query: (inputs) => ({
        url: apiConstants.marketResearch.tam,
        method: 'PUT',
        body: inputs,
      }),
      invalidatesTags: ['MarketResearch'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTamQuery,
  useSaveTamMutation,
} = marketResearchTamApi;
