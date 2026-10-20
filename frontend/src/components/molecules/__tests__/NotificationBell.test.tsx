import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

const mockNotifications = jest.fn();
jest.mock('@/hooks/useNotifications', () => ({
  useNotifications: () => mockNotifications(),
}));

jest.mock('../NotificationPanel', () => ({
  __esModule: true,
  default: () => null,
}));

import NotificationBell from '../NotificationBell';

describe('NotificationBell', () => {
  it('renders bell button with count 0', () => {
    mockNotifications.mockReturnValue({
      unreadCount: 0,
    });
    render(<NotificationBell />);
    expect(
      screen.getByTestId('notification-bell'),
    ).toBeInTheDocument();
  });

  it('shows badge when unread count > 0', () => {
    mockNotifications.mockReturnValue({
      unreadCount: 5,
    });
    render(<NotificationBell />);
    expect(
      screen.getByText('5'),
    ).toBeInTheDocument();
  });

  it('uses custom testId prop', () => {
    mockNotifications.mockReturnValue({
      unreadCount: 0,
    });
    render(<NotificationBell testId="my-bell" />);
    expect(
      screen.getByTestId('my-bell'),
    ).toBeInTheDocument();
  });
});
