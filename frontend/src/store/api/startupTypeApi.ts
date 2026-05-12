/**
 * Startup-type RTK Query endpoints.
 * @module store/api/startupTypeApi
 */
import { baseApi } from './baseApi';
import type {
  StartupType,
  StartupTypeFull,
} from '@/types/startupType';
import apiConstants from '@/constants/api.json';

/** Startup-type API endpoints injected into baseApi. */
export const startupTypeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch the full list of startup archetypes.
     * @returns Array of lightweight StartupType records.
     */
    listStartupTypes: build.query<StartupType[], void>({
      query: () => apiConstants.startupTypes,
      providesTags: ['StartupTypes'],
    }),

    /**
     * Fetch one startup archetype with stages and traps.
     * @param slug - URL-safe identifier of the type.
     * @returns Full startup type detail.
     */
    getStartupType: build.query<StartupTypeFull, string>({
      query: (slug) =>
        `${apiConstants.startupTypes}/${slug}`,
      providesTags: (_result, _error, slug) => [
        { type: 'StartupTypes', id: slug },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListStartupTypesQuery,
  useGetStartupTypeQuery,
} = startupTypeApi;
