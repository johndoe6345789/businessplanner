import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (
    k: string,
    opts?: Record<string, unknown>,
  ) => opts ? `${k} ${JSON.stringify(opts)}` : k,
}));

const toggleMock = jest.fn();
jest.mock('@/hooks/useLaunchChecklist', () => ({
  useLaunchChecklist: () => ({
    items: [
      {
        id: 'item-1', title: 'Ship MVP',
        category: 'product', priority: 'high',
        desc: 'Build and deploy MVP',
      },
    ],
    completed: {},
    toggleItem: toggleMock,
  }),
}));

import { LaunchChecklist } from '../LaunchChecklist';

describe('LaunchChecklist', () => {
  beforeEach(() => {
    toggleMock.mockClear();
  });

  it('renders checklist wrapper', () => {
    render(<LaunchChecklist />);
    expect(
      screen.getByTestId('launch-checklist'),
    ).toBeInTheDocument();
  });

  it('renders checklist items', () => {
    render(<LaunchChecklist />);
    expect(
      screen.getByTestId('launch-checklist-item-item-1'),
    ).toBeInTheDocument();
  });

  it('toggle calls toggleItem with item id', () => {
    render(<LaunchChecklist />);
    fireEvent.click(
      screen.getByTestId('launch-checkbox-item-1'),
    );
    expect(toggleMock).toHaveBeenCalledWith('item-1');
  });
});
