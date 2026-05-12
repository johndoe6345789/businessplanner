/**
 * RTK Query endpoints for financial hypothesis tracking.
 * @module store/api/financialsHypothesisApi
 */
import { baseApi } from './baseApi';
import type { FinancialHypothesis } from '@/types/financials';
import apiConstants from '@/constants/api.json';

/** Partial type for creating a hypothesis. */
type CreateHypothesisInput = Pick<
  FinancialHypothesis,
  'assumption' | 'test_method'
>;

/** Partial type for updating a hypothesis. */
type UpdateHypothesisInput = Partial<
  Omit<FinancialHypothesis, 'id' | 'created_at'>
> & { id: string };

/** Hypothesis CRUD endpoints injected into baseApi. */
export const financialsHypothesisApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * Fetch all financial hypotheses for the user.
       * @returns Array of FinancialHypothesis entries.
       */
      listHypotheses: build.query<
        FinancialHypothesis[],
        void
      >({
        query: () => apiConstants.financials.hypotheses,
        providesTags: ['FinancialHypotheses'],
      }),

      /**
       * Create a new hypothesis.
       * @param input - Assumption and test method.
       */
      createHypothesis: build.mutation<
        FinancialHypothesis,
        CreateHypothesisInput
      >({
        query: (input) => ({
          url: apiConstants.financials.hypotheses,
          method: 'POST',
          body: input,
        }),
        invalidatesTags: ['FinancialHypotheses'],
      }),

      /**
       * Update an existing hypothesis.
       * @param input - Updated fields including id.
       */
      updateHypothesis: build.mutation<
        FinancialHypothesis,
        UpdateHypothesisInput
      >({
        query: ({ id, ...body }) => ({
          url: apiConstants.financials.hypothesis.replace(
            ':id',
            id,
          ),
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['FinancialHypotheses'],
      }),

      /**
       * Delete a hypothesis by id.
       * @param id - Hypothesis identifier.
       */
      deleteHypothesis: build.mutation<void, string>({
        query: (id) => ({
          url: apiConstants.financials.hypothesis.replace(
            ':id',
            id,
          ),
          method: 'DELETE',
        }),
        invalidatesTags: ['FinancialHypotheses'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListHypothesesQuery,
  useCreateHypothesisMutation,
  useUpdateHypothesisMutation,
  useDeleteHypothesisMutation,
} = financialsHypothesisApi;
