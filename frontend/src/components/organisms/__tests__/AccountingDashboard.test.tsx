import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

const dashMock = jest.fn();
jest.mock('@/hooks/useAccountingDashboard', () => ({
  useAccountingDashboard: () => dashMock(),
}));

jest.mock(
  '@/components/molecules/XeroConnectionCard',
  () => ({ __esModule: true,
    default: () => <div data-testid="xero-card" /> }),
);
jest.mock(
  '@/components/molecules/ZeltConnectionCard',
  () => ({ __esModule: true,
    default: () => <div data-testid="zelt-card" /> }),
);
jest.mock(
  '@/components/molecules/AccountingKpiGrid',
  () => ({ __esModule: true,
    default: () => <div data-testid="kpi-grid" /> }),
);

import AccountingDashboard from '../AccountingDashboard';

const kpiBase = {
  totalRevenue: null, cashOnHand: null,
  monthlyPayroll: null, headcount: null,
  outstandingInv: null, isLoading: false,
};

describe('AccountingDashboard', () => {
  it('renders Xero and Zelt connection cards', () => {
    dashMock.mockReturnValue({
      ...kpiBase,
      xeroConnected: false, zeltConnected: false });
    render(<AccountingDashboard />);
    expect(screen.getByTestId('xero-card'))
      .toBeInTheDocument();
    expect(screen.getByTestId('zelt-card'))
      .toBeInTheDocument();
  });

  it('renders KPI grid', () => {
    dashMock.mockReturnValue({
      ...kpiBase,
      xeroConnected: false, zeltConnected: false });
    render(<AccountingDashboard />);
    expect(screen.getByTestId('kpi-grid'))
      .toBeInTheDocument();
  });

  it('shows empty prompt when neither connected', () => {
    dashMock.mockReturnValue({
      ...kpiBase,
      xeroConnected: false, zeltConnected: false });
    render(<AccountingDashboard />);
    expect(screen.getByTestId('accounting-empty'))
      .toBeInTheDocument();
  });

  it('hides empty prompt when Xero connected', () => {
    dashMock.mockReturnValue({
      ...kpiBase,
      xeroConnected: true, zeltConnected: false });
    render(<AccountingDashboard />);
    expect(screen.queryByTestId('accounting-empty'))
      .not.toBeInTheDocument();
  });
});
