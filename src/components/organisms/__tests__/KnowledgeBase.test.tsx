import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/store/hooks', () => ({
  useAppSelector: () => null,
}));

const listMock = jest.fn();

jest.mock('@/store/api/knowledgeApi', () => ({
  useListKbArticlesQuery: () => listMock(),
}));

jest.mock(
  '@/components/molecules/KbFilterChips',
  () => ({
    KbFilterChips: ({
      onChange,
    }: {
      onChange: (f: string) => void;
    }) => (
      <button
        data-testid="filter-chips"
        onClick={() => onChange('all')}
      >
        filter
      </button>
    ),
  }),
);

jest.mock(
  '@/components/molecules/KbArticleCard',
  () => ({
    default: () => (
      <div data-testid="kb-article-card" />
    ),
  }),
);

import { KnowledgeBase } from '../KnowledgeBase';

describe('KnowledgeBase', () => {
  it('renders wrapper', () => {
    listMock.mockReturnValue({
      data: [], isLoading: false,
    });
    render(<KnowledgeBase />);
    expect(
      screen.getByTestId('knowledge-base'),
    ).toBeInTheDocument();
  });

  it('shows loading indicator', () => {
    listMock.mockReturnValue({
      data: undefined, isLoading: true,
    });
    render(<KnowledgeBase />);
    expect(
      screen.getByRole('progressbar'),
    ).toBeInTheDocument();
  });

  it('shows empty state when no articles', () => {
    listMock.mockReturnValue({
      data: [], isLoading: false,
    });
    render(<KnowledgeBase />);
    expect(
      screen.getByTestId('kb-empty'),
    ).toBeInTheDocument();
  });

  it('renders article cards for data', () => {
    listMock.mockReturnValue({
      data: [
        {
          id: 1, title: 'T', slug: 's',
          path: '/p', kbType: 'guide',
          startupType: null, stage: null,
          tags: [], updatedAt: '2024-01-01',
        },
      ],
      isLoading: false,
    });
    render(<KnowledgeBase />);
    expect(
      screen.getByTestId('kb-article-card'),
    ).toBeInTheDocument();
  });
});
