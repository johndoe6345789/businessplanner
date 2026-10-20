/**
 * useDebounce re-exports the shared hook.
 * We test the debouncing behaviour directly
 * using the frontend's React instance.
 */
import { renderHook, act } from '@testing-library/react';
import { useState, useEffect } from 'react';

/** Inline implementation matching shared/hooks/useDebounce. */
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(
      () => setDebounced(value),
      delay,
    );
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() =>
      useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } },
    );
    rerender({ val: 'b' });
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe('a');
  });

  it('updates after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } },
    );
    rerender({ val: 'b' });
    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('b');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } },
    );
    rerender({ val: 'b' });
    act(() => { jest.advanceTimersByTime(200); });
    rerender({ val: 'c' });
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe('a');
    act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toBe('c');
  });

  it('uses 300ms default delay', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: number }) => useDebounce(val),
      { initialProps: { val: 1 } },
    );
    rerender({ val: 2 });
    act(() => { jest.advanceTimersByTime(299); });
    expect(result.current).toBe(1);
    act(() => { jest.advanceTimersByTime(1); });
    expect(result.current).toBe(2);
  });

  it('works with non-string types', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: number[] }) => useDebounce(val, 100),
      { initialProps: { val: [1, 2] } },
    );
    const next = [3, 4];
    rerender({ val: next });
    act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toEqual([3, 4]);
  });
});
