/**
 * RTK Query endpoints for OKR objectives.
 * @module store/api/okrObjectivesApi
 */
import { baseApi } from './baseApi';
import type {
  OkrObjective,
  CreateOkrObjectiveInput,
} from '@/types/okr';
import apiConstants from '@/constants/api.json';

const OBJ = apiConstants.okr.objectives;

/** OKR objectives API endpoints. */
export const okrObjectivesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List all OKR objectives (with key results) for
     * the current user, filtered by quarter/year.
     * @param args - quarter and year filter.
     */
    listOkrObjectives: build.query<
      OkrObjective[],
      { quarter: number; year: number }
    >({
      query: ({ quarter, year }) =>
        `${OBJ}?quarter=${quarter}&year=${year}`,
      providesTags: ['Okr'],
    }),

    /**
     * Create a new OKR objective.
     * @param input - Objective fields.
     */
    createOkrObjective: build.mutation<
      OkrObjective, CreateOkrObjectiveInput
    >({
      query: (body) => ({
        url: OBJ, method: 'POST', body }),
      invalidatesTags: ['Okr'],
    }),

    /**
     * Delete an OKR objective by ID.
     * @param id - UUID of the objective.
     */
    deleteOkrObjective: build.mutation<void, string>({
      query: (id) => ({
        url: `${OBJ}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Okr'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListOkrObjectivesQuery,
  useCreateOkrObjectiveMutation,
  useDeleteOkrObjectiveMutation,
} = okrObjectivesApi;
