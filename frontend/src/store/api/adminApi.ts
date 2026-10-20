/**
 * Admin analytics RTK Query endpoints.
 * @module store/api/adminApi
 */
import { baseApi } from './baseApi';
import type {
  LaunchPadMetrics,
  MetricSummaryItem,
} from '@/types/analytics';
import apiConstants from '@/constants/api.json';

/** Response shape from GET /api/analytics/summary. */
export interface AnalyticsSummaryResponse {
  /** Data-retention window in days. */
  retentionDays: number;
  /** Per-table metric totals. */
  metrics: MetricSummaryItem[];
}

const urls = apiConstants.analytics;

/** Admin analytics endpoints injected into baseApi. */
export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch aggregate metric totals.
     * @returns Summary with per-table counts.
     */
    getAnalyticsSummary: build.query<
      AnalyticsSummaryResponse, void
    >({
      query: () => urls.summary,
      providesTags: ['AdminAnalytics'],
    }),

    /**
     * Fetch LaunchPad-specific KPI metrics.
     * @returns Weekly actives, retention, hypotheses.
     */
    getLaunchPadMetrics: build.query<
      LaunchPadMetrics, void
    >({
      query: () => urls.launchpad,
      providesTags: ['AdminAnalytics'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetLaunchPadMetricsQuery,
} = adminApi;
