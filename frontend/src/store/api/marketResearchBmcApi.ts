/**
 * Market Research Business Model Canvas RTK Query endpoints.
 * @module store/api/marketResearchBmcApi
 */
import { baseApi } from './baseApi';
import type { BmcCanvas } from '@/types/marketResearch';
import apiConstants from '@/constants/api.json';

/** BMC endpoints injected into baseApi. */
export const marketResearchBmcApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * Fetch the saved Business Model Canvas for the user.
       * @returns BmcCanvas or empty defaults.
       */
      getBmc: build.query<BmcCanvas, void>({
        query: () => apiConstants.marketResearch.bmc,
        providesTags: ['MarketResearch'],
      }),

      /**
       * Persist the Business Model Canvas for the user.
       * @param canvas - Full canvas payload to save.
       */
      saveBmc: build.mutation<BmcCanvas, BmcCanvas>({
        query: (canvas) => ({
          url: apiConstants.marketResearch.bmc,
          method: 'PUT',
          body: canvas,
        }),
        invalidatesTags: ['MarketResearch'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetBmcQuery,
  useSaveBmcMutation,
} = marketResearchBmcApi;
