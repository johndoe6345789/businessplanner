/**
 * Legal & Equity RTK Query endpoints.
 * @module store/api/legalApi
 */
import { baseApi } from './baseApi';
import type {
  FounderInput,
  EquitySplitResult,
  VestingParams,
  VestingResult,
} from '@/types/legal';
import apiConstants from '@/constants/api.json';

/** Legal API endpoints injected into baseApi. */
export const legalApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Calculate an equity split for a set of founders.
     * Results are stored server-side for the user's record.
     */
    calculateEquitySplit: build.mutation<
      EquitySplitResult,
      FounderInput[]
    >({
      query: (founders) => ({
        url: apiConstants.legal.equitySplit,
        method: 'POST',
        body: { founders },
      }),
    }),

    /**
     * Calculate a founder vesting schedule and
     * optionally store the parameters server-side.
     */
    calculateVesting: build.mutation<
      VestingResult,
      VestingParams
    >({
      query: (params) => ({
        url: apiConstants.legal.vesting,
        method: 'POST',
        body: params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCalculateEquitySplitMutation,
  useCalculateVestingMutation,
} = legalApi;
