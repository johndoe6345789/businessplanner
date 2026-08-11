import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock(
  '@/components/molecules/PivotDialog',
  () => ({ PivotDialog: () => null }),
);

jest.mock(
  '@/components/molecules/PivotItem',
  () => ({ PivotItem: () => null }),
);

const hookMock = jest.fn();

jest.mock('@/hooks/usePivotTracker', () => ({
  usePivotTracker: () => hookMock(),
}));

import { PivotTracker } from '../PivotTracker';

/** Default hook shape used in most tests. */
const baseHook = () => ({
  data: [],
  isLoading: false,
  isError: false,
  saveError: null,
  open: false,
  setOpen: jest.fn(),
  editing: null,
  form: {},
  setForm: jest.fn(),
  openAdd: jest.fn(),
  openEdit: jest.fn(),
  handleSave: jest.fn(),
  handleDelete: jest.fn(),
});

describe('PivotTracker', () => {
  it('shows loading spinner', () => {
    hookMock.mockReturnValue({
      ...baseHook(), isLoading: true,
    });
    render(<PivotTracker />);
    expect(
      screen.getByRole('progressbar'),
    ).toBeInTheDocument();
  });

  it('shows error state', () => {
    hookMock.mockReturnValue({
      ...baseHook(), isError: true,
    });
    render(<PivotTracker />);
    expect(
      screen.getByTestId('pivot-error'),
    ).toBeInTheDocument();
  });

  it('renders tracker wrapper', () => {
    hookMock.mockReturnValue(baseHook());
    render(<PivotTracker />);
    expect(
      screen.getByTestId('pivot-tracker'),
    ).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    hookMock.mockReturnValue(baseHook());
    render(<PivotTracker />);
    expect(
      screen.getByTestId('pivot-empty'),
    ).toBeInTheDocument();
  });

  it('shows add button', () => {
    hookMock.mockReturnValue(baseHook());
    render(<PivotTracker />);
    expect(
      screen.getByTestId('pivot-add-btn'),
    ).toBeInTheDocument();
  });

  it('shows save error when present', () => {
    hookMock.mockReturnValue({
      ...baseHook(),
      saveError: 'Failed to save. Try again.',
    });
    render(<PivotTracker />);
    expect(
      screen.getByTestId('pivot-save-error'),
    ).toBeInTheDocument();
  });
});
