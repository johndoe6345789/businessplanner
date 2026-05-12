/**
 * RTK Query endpoints for kill criteria data.
 * @module store/api/financialsKillCriteriaApi
 */
import { baseApi } from './baseApi';
import type { KillCriteria } from '@/types/financials';
import apiConstants from '@/constants/api.json';

/** Kill criteria endpoints injected into baseApi. */
export const financialsKillCriteriaApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * Fetch saved kill criteria for the user.
       * @returns Saved KillCriteria or default state.
       */
      getKillCriteria: build.query<KillCriteria, void>({
        query: () => apiConstants.financials.killCriteria,
        providesTags: ['Financials'],
      }),

      /**
       * Persist kill criteria for the current user.
       * @param criteria - KillCriteria to save.
       */
      saveKillCriteria: build.mutation<
        KillCriteria,
        KillCriteria
      >({
        query: (criteria) => ({
          url: apiConstants.financials.killCriteria,
          method: 'PUT',
          body: criteria,
        }),
        invalidatesTags: ['Financials'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetKillCriteriaQuery,
  useSaveKillCriteriaMutation,
} = financialsKillCriteriaApi;
