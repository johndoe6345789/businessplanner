import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import PdcaBoard from '../PdcaBoard';

jest.mock('@/hooks/usePdca', () => ({
  usePdca: jest.fn(),
}));
const { usePdca } =
  jest.requireMock('@/hooks/usePdca');

const noop = jest.fn();
const BASE = {
  cycles: [], isLoading: false,
  activeCycleId: null, setActiveCycleId: noop,
  activeCycle: undefined,
  createCycle: noop, updatePhase: noop,
  deleteCycle: noop,
};

const CYCLE = {
  id: 'c1', user_id: 'u1',
  title: 'Q2 Improvement', description: '',
  current_phase: 'plan' as const,
  status: 'in-progress' as const,
  plan_phase:  { notes: '', completed: false,
    completed_at: null },
  do_phase:    { notes: '', completed: false,
    completed_at: null },
  check_phase: { notes: '', completed: false,
    completed_at: null },
  act_phase:   { notes: '', completed: false,
    completed_at: null },
  created_at: '', updated_at: '',
};

beforeEach(() => {
  jest.clearAllMocks();
  usePdca.mockReturnValue(BASE);
});

describe('PdcaBoard', () => {
  it('renders board container', () => {
    render(<PdcaBoard />);
    expect(screen.getByTestId('pdca-board'))
      .toBeInTheDocument();
  });

  it('shows empty state when no cycles', () => {
    render(<PdcaBoard />);
    expect(screen.getByTestId('pdca-empty'))
      .toBeInTheDocument();
  });

  it('renders cycle cards', () => {
    usePdca.mockReturnValue(
      { ...BASE, cycles: [CYCLE] });
    render(<PdcaBoard />);
    expect(screen.getByTestId('pdca-cycle-card-c1'))
      .toBeInTheDocument();
    expect(
      screen.getByText('Q2 Improvement'),
    ).toBeInTheDocument();
  });

  it('opens create dialog on button click', () => {
    render(<PdcaBoard />);
    fireEvent.click(screen.getByTestId('pdca-add-btn'));
    expect(screen.getByTestId('pdca-create-dialog'))
      .toBeInTheDocument();
  });
});
