/**
 * RTK Query endpoints for the risk-assessment domain.
 * @module store/api/riskAssessmentApi
 */
import { baseApi } from './baseApi';
import type {
  Risk,
  CreateRiskInput,
  UpdateRiskInput,
} from '@/types/riskAssessment';
import apiConstants from '@/constants/api.json';

const BASE = apiConstants.riskAssessment.list;

/** Risk assessment API endpoints. */
export const riskAssessmentApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * Fetch all risks for the current user,
       * ordered by risk_score DESC.
       * @returns Array of Risk objects.
       */
      listRisks: build.query<Risk[], void>({
        query: () => BASE,
        transformResponse: (
          res: { risks: Risk[] },
        ) => res.risks,
        providesTags: ['RiskAssessment'],
      }),

      /**
       * Create a new risk entry.
       * @param input - Risk fields to create.
       * @returns The newly created Risk.
       */
      createRisk: build.mutation<
        Risk, CreateRiskInput
      >({
        query: (body) => ({
          url: BASE,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['RiskAssessment'],
      }),

      /**
       * Update an existing risk entry.
       * @param input - Fields to update + id.
       * @returns The updated Risk.
       */
      updateRisk: build.mutation<
        Risk, UpdateRiskInput
      >({
        query: ({ id, ...body }) => ({
          url: `${BASE}/${id}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['RiskAssessment'],
      }),

      /**
       * Delete a risk entry by ID.
       * @param id - UUID of the risk to delete.
       */
      deleteRisk: build.mutation<void, string>({
        query: (id) => ({
          url: `${BASE}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['RiskAssessment'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListRisksQuery,
  useCreateRiskMutation,
  useUpdateRiskMutation,
  useDeleteRiskMutation,
} = riskAssessmentApi;
