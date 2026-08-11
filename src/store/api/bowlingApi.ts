/**
 * RTK Query endpoints for the bowling chart domain.
 * @module store/api/bowlingApi
 */
import { baseApi } from './baseApi';
import type {
  BowlingObjective,
  BowlingMonth,
  CreateBowlingObjectiveInput,
  UpsertBowlingMonthInput,
} from '@/types/hoshinBowling';
import apiConstants from '@/constants/api.json';

const B = apiConstants.hoshin.bowling;

/** Bowling chart API endpoints. */
export const bowlingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List bowling objectives and their month cells
     * for the given year.
     * @param year - 4-digit year.
     */
    listBowlingObjectives: build.query<
      BowlingObjective[], number
    >({
      query: (year) => `${B}?year=${year}`,
      providesTags: ['Bowling'],
    }),

    /**
     * Create a new bowling objective.
     * @param input - Objective title.
     */
    createBowlingObjective: build.mutation<
      BowlingObjective, CreateBowlingObjectiveInput
    >({
      query: (body) => ({ url: B, method: 'POST', body }),
      invalidatesTags: ['Bowling'],
    }),

    /**
     * Delete a bowling objective by ID.
     * @param id - UUID of the objective.
     */
    deleteBowlingObjective: build.mutation<void, string>({
      query: (id) => ({
        url: `${B}/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Bowling'],
    }),

    /**
     * Upsert a month cell for a bowling objective.
     * @param args - Objective ID and month payload.
     */
    upsertBowlingMonth: build.mutation<
      BowlingMonth,
      { objId: string } & UpsertBowlingMonthInput
    >({
      query: ({ objId, ...body }) => ({
        url: `${B}/${objId}/months`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Bowling'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListBowlingObjectivesQuery,
  useCreateBowlingObjectiveMutation,
  useDeleteBowlingObjectiveMutation,
  useUpsertBowlingMonthMutation,
} = bowlingApi;
