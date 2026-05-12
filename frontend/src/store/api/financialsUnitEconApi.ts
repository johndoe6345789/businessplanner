/**
 * RTK Query endpoints for unit economics data.
 * @module store/api/financialsUnitEconApi
 */
import { baseApi } from './baseApi';
import type { UnitEconInputs } from '@/types/financials';
import apiConstants from '@/constants/api.json';

/** Unit economics endpoints injected into baseApi. */
export const financialsUnitEconApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch saved unit economics inputs.
     * @returns Saved UnitEconInputs or default state.
     */
    getUnitEcon: build.query<UnitEconInputs, void>({
      query: () => apiConstants.financials.unitEcon,
      providesTags: ['Financials'],
    }),

    /**
     * Persist unit economics inputs for the current user.
     * @param inputs - UnitEconInputs to save.
     */
    saveUnitEcon: build.mutation<
      UnitEconInputs,
      UnitEconInputs
    >({
      query: (inputs) => ({
        url: apiConstants.financials.unitEcon,
        method: 'PUT',
        body: inputs,
      }),
      invalidatesTags: ['Financials'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUnitEconQuery,
  useSaveUnitEconMutation,
} = financialsUnitEconApi;
