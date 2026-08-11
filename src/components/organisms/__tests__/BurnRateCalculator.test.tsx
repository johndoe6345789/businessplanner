import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/store/api/financialsBurnApi', () => ({
  useGetBurnQuery: () => ({
    data: undefined,
    isLoading: false,
  }),
  useSaveBurnMutation: () => [jest.fn(), {}],
}));

jest.mock('@/hooks/useBurnCompute', () => ({
  useBurnCompute: () => ({
    runway: 8,
    netBurn: 1000,
    status: 'safe',
  }),
}));

jest.mock(
  '@/components/molecules/BurnInputFields',
  () => ({
    BurnInputFields: () => (
      <div data-testid="burn-input-fields" />
    ),
  }),
);

jest.mock(
  '@/components/molecules/BurnResultDisplay',
  () => ({
    BurnResultDisplay: ({
      result,
    }: { result: { status: string } }) => (
      <div data-testid="burn-result-display">
        {result.status}
      </div>
    ),
  }),
);

import { BurnRateCalculator } from
  '../BurnRateCalculator';

describe('BurnRateCalculator', () => {
  it('renders the calculator wrapper', () => {
    render(<BurnRateCalculator />);
    expect(
      screen.getByTestId('burn-rate-calculator'),
    ).toBeInTheDocument();
  });

  it('renders input fields', () => {
    render(<BurnRateCalculator />);
    expect(
      screen.getByTestId('burn-input-fields'),
    ).toBeInTheDocument();
  });

  it('shows safe status when runway > 6 months', () => {
    render(<BurnRateCalculator />);
    expect(
      screen.getByTestId('burn-result-display'),
    ).toHaveTextContent('safe');
  });
});
