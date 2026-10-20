const getWeekMock = jest.fn();
const submitMock = jest.fn();
const completeStepMock = jest.fn();

jest.mock('@/store/api/weeklyReviewApi', () => ({
  useGetThisWeekQuery: () => getWeekMock(),
  useSubmitReviewMutation: () => [
    submitMock, { isLoading: false },
  ],
}));
jest.mock('@/store/api/gamificationApi', () => ({
  useCompleteStepMutation: () => [completeStepMock],
  useGetMyProgressQuery: () => ({
    data: undefined, isLoading: false,
    isError: false, refetch: jest.fn(),
  }),
}));

import { renderHook, act } from '@testing-library/react';
import { useWeeklyReview } from '../useWeeklyReview';

describe('useWeeklyReview', () => {
  beforeEach(() => {
    getWeekMock.mockReturnValue({ data: null });
    submitMock.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
    completeStepMock.mockReturnValue(
      Promise.resolve({}),
    );
  });

  it('isThisWeekDone is false when no review exists', () => {
    const { result } = renderHook(
      () => useWeeklyReview(),
    );
    expect(result.current.isThisWeekDone).toBe(false);
  });

  it('isThisWeekDone is true when review has an id', () => {
    getWeekMock.mockReturnValue({
      data: { id: 'rev1' },
    });
    const { result } = renderHook(
      () => useWeeklyReview(),
    );
    expect(result.current.isThisWeekDone).toBe(true);
  });

  it('submitReview calls mutation and completeStep', async () => {
    const { result } = renderHook(
      () => useWeeklyReview(),
    );
    const payload = {
      wins: 'win', blockers: '', mood: 4, focus: '',
    };
    await act(async () => {
      await result.current.submitReview(payload);
    });
    expect(submitMock).toHaveBeenCalledWith(payload);
    expect(completeStepMock).toHaveBeenCalled();
  });
});
