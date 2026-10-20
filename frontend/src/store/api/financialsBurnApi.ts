/**
 * RTK Query endpoints for burn rate data.
 * @module store/api/financialsBurnApi
 */
import { baseApi } from './baseApi';
import type { BurnInputs } from '@/types/financials';
import apiConstants from '@/constants/api.json';

/** Burn rate endpoints injected into baseApi. */
export const financialsBurnApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch the user's saved burn rate inputs.
     * @returns Saved BurnInputs or default empty state.
     */
    getBurn: build.query<BurnInputs, void>({
      query: () => apiConstants.financials.burn,
      providesTags: ['Financials'],
    }),

    /**
     * Persist burn rate inputs for the current user.
     * @param inputs - BurnInputs to save.
     */
    saveBurn: build.mutation<BurnInputs, BurnInputs>({
      query: (inputs) => ({
        url: apiConstants.financials.burn,
        method: 'PUT',
        body: inputs,
      }),
      invalidatesTags: ['Financials'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBurnQuery,
  useSaveBurnMutation,
} = financialsBurnApi;
