import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

const mockListQuery = jest.fn(() => ({
  data: [],
  isLoading: false,
}));

jest.mock(
  '@/store/api/financialsHypothesisApi',
  () => ({
    useListHypothesesQuery: () => mockListQuery(),
    useUpdateHypothesisMutation: () => [jest.fn()],
    useDeleteHypothesisMutation: () => [jest.fn()],
  }),
);

jest.mock(
  '@/components/molecules/HypothesisAddForm',
  () => ({
    HypothesisAddForm: () => (
      <button data-testid="hypothesis-add-btn">
        Add
      </button>
    ),
  }),
);

import { HypothesisTracker } from
  '../HypothesisTracker';

describe('HypothesisTracker', () => {
  it('renders the tracker wrapper', () => {
    render(<HypothesisTracker />);
    expect(
      screen.getByTestId('hypothesis-tracker'),
    ).toBeInTheDocument();
  });

  it('shows Add button in empty state', () => {
    render(<HypothesisTracker />);
    expect(
      screen.getByTestId('hypothesis-add-btn'),
    ).toBeInTheDocument();
  });

  it('renders status chips for each hypothesis', () => {
    mockListQuery.mockReturnValueOnce({
      data: [
        { id: '1', assumption: 'Test',
          status: 'untested' },
      ],
      isLoading: false,
    });
    render(<HypothesisTracker />);
    expect(
      screen.getByTestId('hyp-status-1'),
    ).toBeInTheDocument();
  });
});
