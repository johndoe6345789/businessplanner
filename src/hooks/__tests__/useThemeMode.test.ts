const selectorMock = jest.fn();
const savePrefMock = jest.fn();
const syncPrefMock = jest.fn();
const sysPrefMock = jest.fn();
const applyThemeMock = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));
jest.mock('@/store/api/preferencesApi', () => ({
  useGetPreferencesQuery: () => ({ data: null }),
  useUpdatePreferencesMutation: () => [savePrefMock],
}));
jest.mock('../useThemeModeEffects', () => ({
  useSyncPreference: (...a: unknown[]) =>
    syncPrefMock(...a),
  useSystemPrefListener: (...a: unknown[]) =>
    sysPrefMock(...a),
  useApplyTheme: (...a: unknown[]) =>
    applyThemeMock(...a),
}));
jest.mock('../themeModeTypes', () => ({
  getSystemPref: () => 'light',
}));

import { renderHook, act } from '@testing-library/react';
import { useThemeMode } from '../useThemeMode';

describe('useThemeMode', () => {
  beforeEach(() => {
    selectorMock.mockReturnValue(false);
    localStorage.clear();
  });

  it('starts in light mode by default', () => {
    const { result } = renderHook(() => useThemeMode());
    expect(result.current.mode).toBe('light');
  });

  it('setMode changes mode', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => { result.current.setMode('dark'); });
    expect(result.current.mode).toBe('dark');
  });

  it('toggleMode flips light → dark', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => { result.current.toggleMode(); });
    expect(result.current.mode).toBe('dark');
  });

  it('toggleMode flips dark → light', () => {
    const { result } = renderHook(() => useThemeMode());
    act(() => { result.current.setMode('dark'); });
    act(() => { result.current.toggleMode(); });
    expect(result.current.mode).toBe('light');
  });

  it('setMode saves to backend when logged in', () => {
    selectorMock.mockReturnValue(true);
    const { result } = renderHook(() => useThemeMode());
    act(() => { result.current.setMode('dark'); });
    expect(savePrefMock).toHaveBeenCalledWith(
      expect.objectContaining({ themeMode: 'dark' }),
    );
  });
});
