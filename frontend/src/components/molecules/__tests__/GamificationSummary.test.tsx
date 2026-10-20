import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

const mockGamification = jest.fn();
jest.mock('@/hooks', () => ({
  useGamification: () => mockGamification(),
}));

jest.mock('@/components/atoms/LevelBadge', () => ({
  LevelBadge: () => (
    <div data-testid="level-badge" />
  ),
}));

jest.mock('@/components/atoms/StreakCounter', () => ({
  StreakCounter: () => (
    <div data-testid="streak-counter" />
  ),
}));

jest.mock(
  '../GamificationSummaryFull',
  () => ({
    GamificationSummaryFull: () => (
      <div data-testid="xp-bar" />
    ),
  }),
);

import { GamificationSummary } from
  '../GamificationSummary';

describe('GamificationSummary', () => {
  it('renders Skeleton when loading (non-compact)', () => {
    mockGamification.mockReturnValue({
      progress: null,
      isLoading: true,
    });
    render(<GamificationSummary />);
    expect(
      screen.getByTestId('gamification-summary'),
    ).toHaveAttribute('aria-busy', 'true');
  });

  it('shows XP bar when data loads', () => {
    mockGamification.mockReturnValue({
      progress: {
        level: 3, levelTitle: 'Sprout',
        currentStreak: 5, points: 300,
        nextLevelAt: 500, badges: [],
      },
      isLoading: false,
    });
    render(<GamificationSummary />);
    expect(
      screen.getByTestId('xp-bar'),
    ).toBeInTheDocument();
  });

  it('returns null when no data and not loading', () => {
    mockGamification.mockReturnValue({
      progress: null,
      isLoading: false,
    });
    const { container } = render(
      <GamificationSummary />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
