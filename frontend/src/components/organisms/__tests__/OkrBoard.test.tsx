import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import OkrBoard from '../OkrBoard';

jest.mock('@/hooks/useOkr', () => ({
  useOkr: jest.fn(),
}));
const { useOkr } =
  jest.requireMock('@/hooks/useOkr');

const noop = jest.fn();
const BASE = {
  objectives: [], isLoading: false,
  quarter: 2, year: 2026,
  setQuarter: noop, setYear: noop,
  createObjective: noop, deleteObjective: noop,
  addKeyResult: noop, updateKeyResult: noop,
  deleteKeyResult: noop,
};

const OBJ = {
  id: 'o1', user_id: 'u1',
  title: 'Grow revenue',
  description: '',
  quarter: 2, year: 2026,
  status: 'active' as const,
  key_results: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  useOkr.mockReturnValue(BASE);
});

describe('OkrBoard', () => {
  it('renders board container', () => {
    render(<OkrBoard />);
    expect(screen.getByTestId('okr-board'))
      .toBeInTheDocument();
  });

  it('shows empty state with no objectives', () => {
    render(<OkrBoard />);
    expect(screen.getByTestId('okr-empty'))
      .toBeInTheDocument();
  });

  it('renders objective cards', () => {
    useOkr.mockReturnValue(
      { ...BASE, objectives: [OBJ] });
    render(<OkrBoard />);
    expect(screen.getByTestId('okr-obj-card-o1'))
      .toBeInTheDocument();
    expect(
      screen.getByText('Grow revenue'),
    ).toBeInTheDocument();
  });

  it('opens create dialog on add click', () => {
    render(<OkrBoard />);
    fireEvent.click(screen.getByTestId('okr-add-btn'));
    expect(screen.getByTestId('okr-create-dialog'))
      .toBeInTheDocument();
  });
});
