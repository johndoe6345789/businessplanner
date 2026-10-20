const pushMock = jest.fn();
const clearMock = jest.fn();
const submitMock = jest.fn();
const setQueryMock = jest.fn();
const onKeyDownMock = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));
jest.mock('../useGlobalSearch', () => ({
  useGlobalSearch: () => ({
    query: 'react',
    setQuery: setQueryMock,
    suggest: [],
    isLoading: false,
    submit: submitMock,
    clear: clearMock,
  }),
}));
jest.mock('../useSearchKeyboardNav', () => ({
  useSearchKeyboardNav: () => onKeyDownMock,
}));

import { renderHook, act } from '@testing-library/react';
import { useSearchBarState } from '../useSearchBarState';
import type { SearchSuggestItem } from '@/types/search';

const item: SearchSuggestItem = {
  id: '1', type: 'page',
  title: 'React docs', snippet: '', url: '/react',
};

describe('useSearchBarState', () => {
  beforeEach(() => {
    pushMock.mockClear();
    clearMock.mockClear();
  });

  it('exposes query, suggest, and isLoading from useGlobalSearch', () => {
    const { result } = renderHook(
      () => useSearchBarState(),
    );
    expect(result.current.query).toBe('react');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.suggest).toEqual([]);
  });

  it('showDrop is false when query is short', () => {
    const { result } = renderHook(
      () => useSearchBarState(),
    );
    act(() => { result.current.setOpen(false); });
    expect(result.current.showDrop).toBe(false);
  });

  it('onPick navigates to item URL and clears', () => {
    const { result } = renderHook(
      () => useSearchBarState(),
    );
    act(() => { result.current.onPick(item); });
    expect(pushMock).toHaveBeenCalledWith('/react');
    expect(clearMock).toHaveBeenCalled();
  });

  it('exposes onKeyDown from useSearchKeyboardNav', () => {
    const { result } = renderHook(
      () => useSearchBarState(),
    );
    expect(result.current.onKeyDown).toBe(onKeyDownMock);
  });
});
