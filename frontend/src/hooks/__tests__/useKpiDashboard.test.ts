import { renderHook } from '@testing-library/react';

const listMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('@/store/api/kpiApi', () => ({
  useListKpiMetricsQuery: () => listMock(),
  useCreateKpiMetricMutation: () => [createMock],
  useUpdateKpiValueMutation: () => [updateMock],
  useDeleteKpiMetricMutation: () => [deleteMock],
}));

import { useKpiDashboard } from '../useKpiDashboard';
import type { KpiMetric } from '@/types/kpi';

const base: Omit<KpiMetric, 'id' | 'category' | 'status'> = {
  user_id: 'u1', title: 'T', current_value: 1,
  target_value: 2, baseline_value: 0, unit: '%',
  period_start: '2024-01-01', period_end: '2024-12-31',
  created_at: '2024-01-01', updated_at: '2024-01-01',
};
const mkMetric = (
  id: string,
  category: KpiMetric['category'],
  status: KpiMetric['status'],
): KpiMetric => ({ ...base, id, category, status });

describe('useKpiDashboard', () => {
  beforeEach(() => {
    listMock.mockReturnValue({ data: [], isLoading: false });
  });

  it('returns empty groups when no metrics', () => {
    const { result } = renderHook(() => useKpiDashboard());
    expect(result.current.groups).toHaveLength(0);
  });

  it('groups metrics by category', () => {
    listMock.mockReturnValue({
      data: [
        mkMetric('1', 'financial', 'on-track'),
        mkMetric('2', 'customer', 'at-risk'),
      ],
      isLoading: false,
    });
    const { result } = renderHook(() => useKpiDashboard());
    expect(result.current.groups).toHaveLength(2);
    const fin = result.current.groups.find(
      (g) => g.category === 'financial');
    expect(fin?.metrics).toHaveLength(1);
  });

  it('counts onTrack, atRisk, offTrack correctly', () => {
    listMock.mockReturnValue({
      data: [
        mkMetric('1', 'financial', 'on-track'),
        mkMetric('2', 'customer', 'at-risk'),
        mkMetric('3', 'operational', 'off-track'),
        mkMetric('4', 'growth', 'on-track'),
      ],
      isLoading: false,
    });
    const { result } = renderHook(() => useKpiDashboard());
    expect(result.current.onTrack).toBe(2);
    expect(result.current.atRisk).toBe(1);
    expect(result.current.offTrack).toBe(1);
  });

  it('excludes empty-category groups', () => {
    listMock.mockReturnValue({
      data: [mkMetric('1', 'financial', 'on-track')],
      isLoading: false,
    });
    const { result } = renderHook(() => useKpiDashboard());
    expect(result.current.groups.every(
      (g) => g.metrics.length > 0)).toBe(true);
  });

  it('exposes mutations and isLoading', () => {
    listMock.mockReturnValue({ data: [], isLoading: true });
    const { result } = renderHook(() => useKpiDashboard());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.createMetric).toBe(createMock);
    expect(result.current.updateValue).toBe(updateMock);
    expect(result.current.deleteMetric).toBe(deleteMock);
  });
});
