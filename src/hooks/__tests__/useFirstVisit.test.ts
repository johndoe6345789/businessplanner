import { renderHook, act } from '@testing-library/react';
import { useFirstVisit } from '../useFirstVisit';

const KEY = 'businessplanner-welcomed';

describe('useFirstVisit', () => {
  beforeEach(() => localStorage.clear());

  it('returns true when localStorage is empty', () => {
    const { result } = renderHook(() => useFirstVisit());
    expect(result.current.isFirstVisit).toBe(true);
  });

  it('returns false when already welcomed', () => {
    localStorage.setItem(KEY, 'true');
    const { result } = renderHook(() => useFirstVisit());
    expect(result.current.isFirstVisit).toBe(false);
  });

  it('dismiss sets isFirstVisit to false', () => {
    const { result } = renderHook(() => useFirstVisit());
    act(() => { result.current.dismiss(); });
    expect(result.current.isFirstVisit).toBe(false);
  });

  it('dismiss persists welcomed flag to localStorage', () => {
    const { result } = renderHook(() => useFirstVisit());
    act(() => { result.current.dismiss(); });
    expect(localStorage.getItem(KEY)).toBe('true');
  });
});
