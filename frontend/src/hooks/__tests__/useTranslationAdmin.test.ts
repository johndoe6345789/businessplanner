const localesMock = jest.fn();
const transMock = jest.fn();
const upsertMock = jest.fn();

jest.mock('@/store/api/translationApi', () => ({
  useGetLocalesQuery: () => localesMock(),
  useGetTranslationsQuery: (_l: string) => transMock(),
  useUpsertTranslationMutation: () => [upsertMock],
}));

import { renderHook, act } from '@testing-library/react';
import {
  useTranslationAdmin,
} from '../useTranslationAdmin';

describe('useTranslationAdmin', () => {
  beforeEach(() => {
    localesMock.mockReturnValue({
      data: { locales: ['en', 'fr'] },
    });
    transMock.mockReturnValue({
      data: { auth: { login: { title: 'Login' } } },
      isLoading: false, refetch: jest.fn(),
    });
    upsertMock.mockResolvedValue({});
  });

  it('initialises with locale "en" and empty filter', () => {
    const { result } = renderHook(
      () => useTranslationAdmin(),
    );
    expect(result.current.locale).toBe('en');
    expect(result.current.filter).toBe('');
  });

  it('setLocale updates locale', () => {
    const { result } = renderHook(
      () => useTranslationAdmin(),
    );
    act(() => { result.current.setLocale('fr'); });
    expect(result.current.locale).toBe('fr');
  });

  it('rows are derived from translation data', () => {
    const { result } = renderHook(
      () => useTranslationAdmin(),
    );
    expect(result.current.rows.length).toBeGreaterThan(0);
  });

  it('filter reduces rows to matching namespace', () => {
    const { result } = renderHook(
      () => useTranslationAdmin(),
    );
    act(() => { result.current.setFilter('auth'); });
    result.current.rows.forEach(
      (r) => expect(r.ns).toBe('auth'),
    );
  });

  it('save calls upsert with locale, ns, key, value', async () => {
    const { result } = renderHook(
      () => useTranslationAdmin(),
    );
    await act(async () => {
      await result.current.save('auth', 'title', 'Hi');
    });
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        locale: 'en', namespace: 'auth',
        key: 'title', value: 'Hi',
      }),
    );
  });
});
