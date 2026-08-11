import React from 'react';
import { render, screen } from '@testing-library/react';
import KpiScorecard from '../KpiScorecard';

jest.mock('@/hooks/useKpiDashboard', () => ({
  useKpiDashboard: jest.fn(),
}));
const { useKpiDashboard } =
  jest.requireMock('@/hooks/useKpiDashboard');

const noop = jest.fn();
const BASE = {
  groups: [], onTrack: 0, atRisk: 0, offTrack: 0,
  isLoading: false,
  createMetric: noop, updateValue: noop,
  deleteMetric: noop,
};

beforeEach(() => {
  jest.clearAllMocks();
  useKpiDashboard.mockReturnValue(BASE);
});

describe('KpiScorecard', () => {
  it('renders scorecard container', () => {
    render(<KpiScorecard />);
    expect(screen.getByTestId('kpi-scorecard'))
      .toBeInTheDocument();
  });

  it('renders summary chips', () => {
    useKpiDashboard.mockReturnValue({
      ...BASE, onTrack: 3, atRisk: 1, offTrack: 2,
    });
    render(<KpiScorecard />);
    expect(screen.getByTestId('kpi-summary-on-track'))
      .toBeInTheDocument();
    expect(screen.getByTestId('kpi-summary-at-risk'))
      .toBeInTheDocument();
    expect(screen.getByTestId('kpi-summary-off-track'))
      .toBeInTheDocument();
  });

  it('shows empty state when no metrics', () => {
    render(<KpiScorecard />);
    expect(screen.getByTestId('kpi-empty'))
      .toBeInTheDocument();
  });

  it('renders metric cards when data present', () => {
    const metric = {
      id: 'm1', user_id: 'u1', title: 'MRR',
      category: 'financial' as const,
      current_value: 5000, target_value: 10000,
      baseline_value: 0, unit: '£',
      status: 'at-risk' as const,
      period_start: '2026-01-01',
      period_end: '2026-03-31',
      created_at: '', updated_at: '',
    };
    useKpiDashboard.mockReturnValue({
      ...BASE,
      groups: [{ category: 'financial',
        metrics: [metric] }],
    });
    render(<KpiScorecard />);
    expect(screen.getByTestId('kpi-metric-card-m1'))
      .toBeInTheDocument();
    expect(screen.getByText('MRR')).toBeInTheDocument();
  });
});
