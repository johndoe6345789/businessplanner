import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

jest.mock('@/hooks/useWeeklyReview', () => ({
  useWeeklyReview: () => ({
    thisWeek: null,
    submitReview: jest.fn(),
    isSubmitting: false,
  }),
}));

import { WeeklyReviewForm } from '../WeeklyReviewForm';

describe('WeeklyReviewForm', () => {
  it('renders the form wrapper', () => {
    render(<WeeklyReviewForm />);
    expect(
      screen.getByTestId('weekly-review-form'),
    ).toBeInTheDocument();
  });

  it('renders wins textarea', () => {
    render(<WeeklyReviewForm />);
    expect(
      screen.getByTestId('review-wins'),
    ).toBeInTheDocument();
  });

  it('renders challenges and next-goals fields', () => {
    render(<WeeklyReviewForm />);
    expect(
      screen.getByTestId('review-challenges'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('review-next-goals'),
    ).toBeInTheDocument();
  });

  it('save button enabled when not submitting', () => {
    render(<WeeklyReviewForm />);
    expect(
      screen.getByTestId('review-save-btn'),
    ).toBeEnabled();
  });
});
