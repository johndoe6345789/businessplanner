import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock(
  '@/components/molecules/AcceleratorDialog',
  () => ({ AcceleratorDialog: () => null }),
);

jest.mock(
  '@/components/molecules/AcceleratorItem',
  () => ({ AcceleratorItem: () => null }),
);

const hookMock = jest.fn();

jest.mock('@/hooks/useAcceleratorTracker', () => ({
  useAcceleratorTracker: () => hookMock(),
}));

import { AcceleratorTracker }
  from '../AcceleratorTracker';

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

describe('AcceleratorTracker', () => {
  it('shows loading spinner', () => {
    hookMock.mockReturnValue({
      ...baseHook(), isLoading: true,
    });
    render(<AcceleratorTracker />);
    expect(
      screen.getByRole('progressbar'),
    ).toBeInTheDocument();
  });

  it('shows error state', () => {
    hookMock.mockReturnValue({
      ...baseHook(), isError: true,
    });
    render(<AcceleratorTracker />);
    expect(
      screen.getByTestId('accel-error'),
    ).toBeInTheDocument();
  });

  it('renders tracker wrapper', () => {
    hookMock.mockReturnValue(baseHook());
    render(<AcceleratorTracker />);
    expect(
      screen.getByTestId('accelerator-tracker'),
    ).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    hookMock.mockReturnValue(baseHook());
    render(<AcceleratorTracker />);
    expect(
      screen.getByTestId('accel-empty'),
    ).toBeInTheDocument();
  });

  it('shows add button', () => {
    hookMock.mockReturnValue(baseHook());
    render(<AcceleratorTracker />);
    expect(
      screen.getByTestId('accel-add-btn'),
    ).toBeInTheDocument();
  });

  it('shows save error when present', () => {
    hookMock.mockReturnValue({
      ...baseHook(),
      saveError: 'Failed to save. Try again.',
    });
    render(<AcceleratorTracker />);
    expect(
      screen.getByTestId('accel-save-error'),
    ).toBeInTheDocument();
  });
});
