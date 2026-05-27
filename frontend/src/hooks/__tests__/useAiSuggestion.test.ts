const selectorMock = jest.fn();
const getMutMock = jest.fn();

jest.mock('@/store/hooks', () => ({
  useAppSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));
jest.mock('@/store/api/aiApi', () => ({
  useGetAiStepSuggestionMutation: () => [
    getMutMock, { isLoading: false },
  ],
}));

import { renderHook, act } from '@testing-library/react';
import { useAiSuggestion } from '../useAiSuggestion';

describe('useAiSuggestion', () => {
  beforeEach(() => {
    selectorMock.mockReturnValue('saas');
    getMutMock.mockReturnValue({
      unwrap: () =>
        Promise.resolve({ suggestion: 'AI tip' }),
    });
  });

  it('initialises with undefined suggestion and no error', () => {
    const { result } = renderHook(
      () => useAiSuggestion(),
    );
    expect(result.current.suggestion).toBeUndefined();
    expect(result.current.error).toBe(false);
  });

  it('fetchSuggestion resolves suggestion text', async () => {
    const { result } = renderHook(
      () => useAiSuggestion(),
    );
    await act(async () => {
      result.current.fetchSuggestion('s1', 'Research');
      await Promise.resolve();
    });
    expect(result.current.suggestion).toBe('AI tip');
  });

  it('dismiss clears suggestion and error', async () => {
    const { result } = renderHook(
      () => useAiSuggestion(),
    );
    await act(async () => {
      result.current.fetchSuggestion('s1', 'Research');
      await Promise.resolve();
    });
    act(() => { result.current.dismiss(); });
    expect(result.current.suggestion).toBeUndefined();
    expect(result.current.error).toBe(false);
  });

  it('sets error flag on fetch failure', async () => {
    getMutMock.mockReturnValue({
      unwrap: () => Promise.reject(new Error('fail')),
    });
    const { result } = renderHook(
      () => useAiSuggestion(),
    );
    await act(async () => {
      result.current.fetchSuggestion('s1', 'Research');
      await Promise.resolve();
    });
    expect(result.current.error).toBe(true);
  });
});
