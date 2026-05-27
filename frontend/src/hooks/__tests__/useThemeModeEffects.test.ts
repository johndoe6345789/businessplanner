import { renderHook, act } from '@testing-library/react';
import {
  useSyncPreference,
  useApplyTheme,
} from '../useThemeModeEffects';

describe('useSyncPreference', () => {
  it('calls setMode when themeMode is provided', () => {
    const setMode = jest.fn();
    renderHook(() =>
      useSyncPreference('dark', setMode),
    );
    expect(setMode).toHaveBeenCalledWith('dark');
  });

  it('does not call setMode when themeMode is undefined', () => {
    const setMode = jest.fn();
    renderHook(() =>
      useSyncPreference(undefined, setMode),
    );
    expect(setMode).not.toHaveBeenCalled();
  });

  it('re-calls setMode when themeMode changes', () => {
    const setMode = jest.fn();
    const { rerender } = renderHook(
      ({ m }: { m: 'light' | 'dark' | undefined }) =>
        useSyncPreference(m, setMode),
      { initialProps: { m: undefined as 'light' | 'dark' | undefined } },
    );
    rerender({ m: 'light' });
    expect(setMode).toHaveBeenCalledWith('light');
  });
});

describe('useApplyTheme', () => {
  beforeEach(() => localStorage.clear());

  it('adds resolved class to documentElement', () => {
    renderHook(() => useApplyTheme('dark', 'dark'));
    expect(
      document.documentElement.classList.contains('dark'),
    ).toBe(true);
  });

  it('persists mode to localStorage', () => {
    act(() => {
      renderHook(() => useApplyTheme('system', 'light'));
    });
    expect(localStorage.getItem('theme-mode')).toBe('system');
  });

  it('removes previous class when mode changes', () => {
    const { rerender } = renderHook(
      ({ r }: { r: 'light' | 'dark' }) =>
        useApplyTheme(r, r),
      { initialProps: { r: 'dark' as 'light' | 'dark' } },
    );
    rerender({ r: 'light' });
    expect(
      document.documentElement.classList.contains('dark'),
    ).toBe(false);
    expect(
      document.documentElement.classList.contains('light'),
    ).toBe(true);
  });
});
