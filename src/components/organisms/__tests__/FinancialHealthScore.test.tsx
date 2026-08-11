import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

import { FinancialHealthScore } from
  '../FinancialHealthScore';

const baseHealth = {
  runway_score: 80,
  ltv_cac_score: 60,
  churn_score: 70,
  mrr_score: 50,
};

describe('FinancialHealthScore', () => {
  it('renders with score 75 (Healthy)', () => {
    render(
      <FinancialHealthScore
        health={{ ...baseHealth, score: 75,
          label: 'Healthy' }}
      />,
    );
    expect(
      screen.getByTestId('financial-health-score'),
    ).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders Healthy label for score >= 70', () => {
    render(
      <FinancialHealthScore
        health={{ ...baseHealth, score: 70,
          label: 'Healthy' }}
      />,
    );
    expect(
      screen.getByText('health.healthy'),
    ).toBeInTheDocument();
  });

  it('renders Caution label for mid-range score', () => {
    render(
      <FinancialHealthScore
        health={{ ...baseHealth, score: 50,
          label: 'Caution' }}
      />,
    );
    expect(
      screen.getByText('health.caution'),
    ).toBeInTheDocument();
  });

  it('renders At Risk label for low score', () => {
    render(
      <FinancialHealthScore
        health={{ ...baseHealth, score: 20,
          label: 'At Risk' }}
      />,
    );
    expect(
      screen.getByText('health.atRisk'),
    ).toBeInTheDocument();
  });
});
