/**
 * @file useKpiDashboard.ts
 * @brief Aggregates KPI metrics by category and
 *        computes traffic-light summary counts.
 */

import { useMemo } from 'react';
import {
  useListKpiMetricsQuery,
  useCreateKpiMetricMutation,
  useUpdateKpiValueMutation,
  useDeleteKpiMetricMutation,
} from '@/store/api/kpiApi';
import type { KpiCategory, KpiMetric } from '@/types/kpi';

/** Per-category group of metrics. */
export interface KpiCategoryGroup {
  category: KpiCategory;
  metrics: KpiMetric[];
}

/** Aggregated dashboard state. */
export interface KpiDashboard {
  groups: KpiCategoryGroup[];
  onTrack: number;
  atRisk: number;
  offTrack: number;
  isLoading: boolean;
  createMetric: ReturnType<
    typeof useCreateKpiMetricMutation>[0];
  updateValue: ReturnType<
    typeof useUpdateKpiValueMutation>[0];
  deleteMetric: ReturnType<
    typeof useDeleteKpiMetricMutation>[0];
}

const CATEGORIES: KpiCategory[] = [
  'financial', 'customer', 'operational', 'growth',
];

/**
 * @brief Provides grouped KPI metrics and mutation
 *        callbacks for the KPI scorecard page.
 * @returns KpiDashboard aggregate.
 */
export function useKpiDashboard(): KpiDashboard {
  const { data: metrics = [], isLoading } =
    useListKpiMetricsQuery();
  const [createMetric] = useCreateKpiMetricMutation();
  const [updateValue] = useUpdateKpiValueMutation();
  const [deleteMetric] = useDeleteKpiMetricMutation();

  const groups = useMemo(
    () => CATEGORIES.map((cat) => ({
      category: cat,
      metrics: metrics.filter(
        (m) => m.category === cat),
    })).filter((g) => g.metrics.length > 0),
    [metrics],
  );

  const onTrack = useMemo(
    () => metrics.filter(
      (m) => m.status === 'on-track').length, [metrics]);
  const atRisk = useMemo(
    () => metrics.filter(
      (m) => m.status === 'at-risk').length, [metrics]);
  const offTrack = useMemo(
    () => metrics.filter(
      (m) => m.status === 'off-track').length, [metrics]);

  return {
    groups, onTrack, atRisk, offTrack, isLoading,
    createMetric, updateValue, deleteMetric,
  };
}
