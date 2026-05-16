import React from 'react';
import { render, screen, fireEvent } from
  '@testing-library/react';
import WelcomeBanner from '../WelcomeBanner';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));
jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: {
    children: React.ReactNode; href: string;
  }) => <a href={href}>{children}</a>,
}));
jest.mock('@/hooks/useFirstVisit', () => ({
  useFirstVisit: jest.fn(),
}));
const { useFirstVisit } =
  jest.requireMock('@/hooks/useFirstVisit');

const mockDismiss = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useFirstVisit.mockReturnValue({
    isFirstVisit: true,
    dismiss: mockDismiss,
  });
});

describe('WelcomeBanner', () => {
  it('renders when first visit', () => {
    render(<WelcomeBanner />);
    expect(screen.getByTestId('welcome-banner'))
      .toBeInTheDocument();
  });

  it('renders planner and setup CTAs', () => {
    render(<WelcomeBanner />);
    expect(screen.getByTestId('welcome-cta-planner'))
      .toBeInTheDocument();
    expect(screen.getByTestId('welcome-cta-setup'))
      .toBeInTheDocument();
  });

  it('returns null when not first visit', () => {
    useFirstVisit.mockReturnValue({
      isFirstVisit: false, dismiss: mockDismiss,
    });
    const { container } = render(<WelcomeBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('calls dismiss on close', () => {
    render(<WelcomeBanner />);
    const closeBtn = screen.getByRole('button', {
      name: /close/i,
    });
    fireEvent.click(closeBtn);
    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });
});
