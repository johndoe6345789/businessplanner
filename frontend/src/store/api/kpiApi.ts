/**
 * RTK Query endpoints for the KPI scorecard domain.
 * @module store/api/kpiApi
 */
import { baseApi } from './baseApi';
import type {
  KpiMetric,
  CreateKpiInput,
  UpdateKpiValueInput,
} from '@/types/kpi';
import apiConstants from '@/constants/api.json';

const M = apiConstants.kpi.metrics;

/** KPI scorecard API endpoints. */
export const kpiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List all KPI metrics for the current user.
     * @returns Array of KpiMetric.
     */
    listKpiMetrics: build.query<KpiMetric[], void>({
      query: () => M,
      providesTags: ['Kpi'],
    }),

    /**
     * Create a new KPI metric.
     * @param input - Metric fields.
     * @returns The created KpiMetric.
     */
    createKpiMetric: build.mutation<
      KpiMetric, CreateKpiInput
    >({
      query: (body) => ({ url: M, method: 'POST', body }),
      invalidatesTags: ['Kpi'],
    }),

    /**
     * Update the current value of a KPI metric.
     * @param args - Metric ID and new value.
     * @returns The updated KpiMetric.
     */
    updateKpiValue: build.mutation<
      KpiMetric,
      { id: string } & UpdateKpiValueInput
    >({
      query: ({ id, ...body }) => ({
        url: `${M}/${id}/value`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Kpi'],
    }),

    /**
     * Delete a KPI metric by ID.
     * @param id - UUID of the metric.
     */
    deleteKpiMetric: build.mutation<void, string>({
      query: (id) => ({
        url: `${M}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Kpi'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListKpiMetricsQuery,
  useCreateKpiMetricMutation,
  useUpdateKpiValueMutation,
  useDeleteKpiMetricMutation,
} = kpiApi;
