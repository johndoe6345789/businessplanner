import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/hooks/useScopingCanvas', () => ({
  useScopingCanvas: () => ({
    ranked: [],
    isLoading: false,
    dialogOpen: false,
    editing: null,
    openAdd: jest.fn(),
    openEdit: jest.fn(),
    closeDialog: jest.fn(),
    handleStatus: jest.fn(),
    handleSubmit: jest.fn(),
    handleDelete: jest.fn(),
  }),
}));

jest.mock(
  '@/components/organisms/ScopingLane',
  () => ({
    ScopingLane: ({
      testId,
    }: { testId: string }) => (
      <div data-testid={testId} role="region" />
    ),
  }),
);

jest.mock(
  '@/components/molecules/FeatureForm',
  () => ({
    FeatureForm: () => null,
  }),
);

import { ProductScopingCanvas } from
  '../ProductScopingCanvas';

describe('ProductScopingCanvas', () => {
  it('renders canvas wrapper', () => {
    render(<ProductScopingCanvas />);
    expect(
      screen.getByTestId('product-scoping-canvas'),
    ).toBeInTheDocument();
  });

  it('renders Add Feature button', () => {
    render(<ProductScopingCanvas />);
    expect(
      screen.getByTestId('scoping-add-btn'),
    ).toBeInTheDocument();
  });

  it('renders 4 swim lanes', () => {
    render(<ProductScopingCanvas />);
    expect(
      screen.getAllByRole('region'),
    ).toHaveLength(4);
  });
});
