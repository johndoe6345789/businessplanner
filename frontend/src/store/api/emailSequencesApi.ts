/**
 * Email sequences RTK Query endpoints.
 * @module store/api/emailSequencesApi
 */
import { baseApi } from './baseApi';

/** Email sequences endpoints injected into baseApi. */
export const emailSequencesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Opt the authenticated user out of all email
     * sequences (welcome drip + re-engagement).
     *
     * @returns Empty success object.
     */
    optOut: build.mutation<{ opted_out: boolean }, void>({
      query: () => ({
        url: '/email-sequences/opt-out',
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useOptOutMutation } = emailSequencesApi;
