const replaceMock = jest.fn();
const params = new URLSearchParams('q=react&type=kb_content&page=3');

jest.mock('next/navigation', () => ({
  useSearchParams: () => params,
}));
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/en/search',
}));

import { renderHook, act } from '@testing-library/react';
import {
  useSearchPageState,
} from '../useSearchPageState';

describe('useSearchPageState', () => {
  beforeEach(() => replaceMock.mockClear());

  it('reads q, tab, and page from URL params', () => {
    const { result } = renderHook(
      () => useSearchPageState(),
    );
    expect(result.current.q).toBe('react');
    expect(result.current.tab).toBe('kb_content');
    expect(result.current.page).toBe(3);
  });

  it('exposes pageSize constant', () => {
    const { result } = renderHook(
      () => useSearchPageState(),
    );
    expect(result.current.pageSize).toBe(20);
  });

  it('setTab calls router.replace with updated params', () => {
    const { result } = renderHook(
      () => useSearchPageState(),
    );
    act(() => { result.current.setTab('founders'); });
    expect(replaceMock).toHaveBeenCalledWith(
      expect.stringContaining('type=founders'),
    );
  });

  it('setTab with "all" removes type param', () => {
    const { result } = renderHook(
      () => useSearchPageState(),
    );
    act(() => { result.current.setTab('all'); });
    const called = replaceMock.mock.calls[0][0] as string;
    expect(called).not.toContain('type=');
  });

  it('setPage with value > 1 adds page param', () => {
    const { result } = renderHook(
      () => useSearchPageState(),
    );
    act(() => { result.current.setPage(5); });
    expect(replaceMock).toHaveBeenCalledWith(
      expect.stringContaining('page=5'),
    );
  });
});
