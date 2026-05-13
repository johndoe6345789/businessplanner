import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/hooks/useDecisionLog', () => ({
  useDecisionLog: () => ({
    search: '',
    setSearch: jest.fn(),
    dialogOpen: false,
    setDialogOpen: jest.fn(),
    editing: null,
    form: {},
    setForm: jest.fn(),
    data: [],
    isLoading: false,
    openAdd: jest.fn(),
    openEdit: jest.fn(),
    handleSave: jest.fn(),
    handleDelete: jest.fn(),
  }),
}));

jest.mock(
  '@/components/molecules/DecisionCard',
  () => ({
    DecisionCard: () => null,
  }),
);

jest.mock('../DecisionDialog', () => ({
  DecisionDialog: () => null,
}));

import { DecisionLog } from '../DecisionLog';

describe('DecisionLog', () => {
  it('renders the decision log wrapper', () => {
    render(<DecisionLog />);
    expect(
      screen.getByTestId('decision-log'),
    ).toBeInTheDocument();
  });

  it('renders search field', () => {
    render(<DecisionLog />);
    expect(
      screen.getByTestId('dec-search'),
    ).toBeInTheDocument();
  });

  it('shows empty state message when no decisions', () => {
    render(<DecisionLog />);
    expect(
      screen.getByTestId('dec-empty'),
    ).toBeInTheDocument();
  });
});
