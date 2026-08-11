import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/components/molecules/StartupScoreCard', () => ({
  StartupScoreCard: ({ profile, isBest }: {
    profile: { org: { name: string } }; isBest?: boolean;
  }) => (
    <div data-testid={isBest ? 'best-card' : 'other-card'}>
      {profile.org.name}
    </div>
  ),
}));

jest.mock('@/components/molecules/StartupStepsPanel', () => ({
  StartupStepsPanel: ({ orgId }: { orgId: string }) => (
    <div data-testid={`steps-${orgId}`} />
  ),
}));

const hookMock = jest.fn();
jest.mock('@/hooks/useStartupComparison', () => ({
  useStartupComparison: () => hookMock(),
}));

import { StartupCompareBoard }
  from '../StartupCompareBoard';

const base = () =>
  ({ profiles: [], isLoading: false, isError: false });
const mkP = (name: string) =>
  ({ org: { id: name, name }, totalScore: 10,
    riskCount: 2, breakdown: [], level: 'low' as const });

describe('StartupCompareBoard', () => {
  it('shows loading skeletons', () => {
    hookMock.mockReturnValue({ ...base(), isLoading: true });
    render(<StartupCompareBoard />);
    expect(screen.getByTestId('compare-board-loading'))
      .toBeInTheDocument();
  });

  it('shows empty state when no profiles', () => {
    hookMock.mockReturnValue(base());
    render(<StartupCompareBoard />);
    expect(screen.getByTestId('compare-board-empty'))
      .toBeInTheDocument();
  });

  it('shows empty state on error', () => {
    hookMock.mockReturnValue({ ...base(), isError: true });
    render(<StartupCompareBoard />);
    expect(screen.getByTestId('compare-board-empty'))
      .toBeInTheDocument();
  });

  it('renders best-card for first profile', () => {
    hookMock.mockReturnValue({
      ...base(), profiles: [mkP('Alpha'), mkP('Beta')] });
    render(<StartupCompareBoard />);
    expect(screen.getByTestId('best-card'))
      .toHaveTextContent('Alpha');
    expect(screen.getByTestId('other-card'))
      .toHaveTextContent('Beta');
  });

  it('renders board testid with data', () => {
    hookMock.mockReturnValue({
      ...base(), profiles: [mkP('Solo')] });
    render(<StartupCompareBoard />);
    expect(screen.getByTestId('compare-board'))
      .toBeInTheDocument();
  });
});
