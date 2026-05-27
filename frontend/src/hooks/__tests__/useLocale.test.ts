const pushMock = jest.fn();
const savePrefMock = jest.fn();
const selectorMock = jest.fn();

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/en/dashboard',
}));
jest.mock('@/i18n/config', () => ({
  locales: ['en', 'fr', 'de'],
}));
jest.mock('@/store/api/translationApi', () => ({
  useGetLocalesQuery: () => ({
    data: { locales: ['en', 'fr'] },
  }),
}));
jest.mock('@/store/api/preferencesApi', () => ({
  useGetPreferencesQuery: () => ({ data: null }),
  useUpdatePreferencesMutation: () => [savePrefMock],
}));
jest.mock('react-redux', () => ({
  useSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));

import { renderHook, act } from '@testing-library/react';
import { useLocale } from '../useLocale';

describe('useLocale', () => {
  beforeEach(() => {
    selectorMock.mockReturnValue(false);
    pushMock.mockClear();
    savePrefMock.mockClear();
  });

  it('returns current locale from next-intl', () => {
    const { result } = renderHook(() => useLocale());
    expect(result.current.locale).toBe('en');
  });

  it('returns locales list from API', () => {
    const { result } = renderHook(() => useLocale());
    expect(result.current.locales).toContain('en');
    expect(result.current.locales).toContain('fr');
  });

  it('setLocale calls router.push with new locale', () => {
    const { result } = renderHook(() => useLocale());
    act(() => {
      result.current.setLocale('fr' as never);
    });
    expect(pushMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ locale: 'fr' }),
    );
  });

  it('setLocale saves preference when logged in', () => {
    selectorMock.mockReturnValue(true);
    const { result } = renderHook(() => useLocale());
    act(() => {
      result.current.setLocale('de' as never);
    });
    expect(savePrefMock).toHaveBeenCalledWith(
      expect.objectContaining({ locale: 'de' }),
    );
  });
});
