const pushMock = jest.fn();
const resetMock = jest.fn();

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));
jest.mock('../useSuggestFetch', () => ({
  useSuggestFetch: () => ({
    suggest: [], isLoading: false, reset: resetMock,
  }),
}));

import { renderHook, act } from '@testing-library/react';
import { useGlobalSearch } from '../useGlobalSearch';

describe('useGlobalSearch', () => {
  beforeEach(() => {
    pushMock.mockClear();
    resetMock.mockClear();
  });

  it('initialises with empty query', () => {
    const { result } = renderHook(
      () => useGlobalSearch(),
    );
    expect(result.current.query).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('setQuery updates query', () => {
    const { result } = renderHook(
      () => useGlobalSearch(),
    );
    act(() => { result.current.setQuery('react'); });
    expect(result.current.query).toBe('react');
  });

  it('clear resets query and calls reset', () => {
    const { result } = renderHook(
      () => useGlobalSearch(),
    );
    act(() => { result.current.setQuery('react'); });
    act(() => { result.current.clear(); });
    expect(result.current.query).toBe('');
    expect(resetMock).toHaveBeenCalled();
  });

  it('submit navigates to /search with query', () => {
    const { result } = renderHook(
      () => useGlobalSearch(),
    );
    act(() => { result.current.setQuery('react'); });
    act(() => { result.current.submit(); });
    expect(pushMock).toHaveBeenCalledWith(
      expect.stringContaining('q=react'),
      expect.any(Object),
    );
  });

  it('submit with empty query does nothing', () => {
    const { result } = renderHook(
      () => useGlobalSearch(),
    );
    act(() => { result.current.submit(); });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
