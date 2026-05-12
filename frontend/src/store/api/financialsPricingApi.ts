/**
 * RTK Query endpoints for pricing / revenue model data.
 * @module store/api/financialsPricingApi
 */
import { baseApi } from './baseApi';
import type { PricingInputs } from '@/types/financials';
import apiConstants from '@/constants/api.json';

/** Pricing endpoints injected into baseApi. */
export const financialsPricingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch saved pricing inputs.
     * @returns Saved PricingInputs or default state.
     */
    getPricing: build.query<PricingInputs, void>({
      query: () => apiConstants.financials.pricing,
      providesTags: ['Financials'],
    }),

    /**
     * Persist pricing inputs for the current user.
     * @param inputs - PricingInputs to save.
     */
    savePricing: build.mutation<PricingInputs, PricingInputs>(
      {
        query: (inputs) => ({
          url: apiConstants.financials.pricing,
          method: 'PUT',
          body: inputs,
        }),
        invalidatesTags: ['Financials'],
      },
    ),
  }),
  overrideExisting: false,
});

export const {
  useGetPricingQuery,
  useSavePricingMutation,
} = financialsPricingApi;
