const replaceMock = jest.fn();
const searchParamsMock = { get: jest.fn() };

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParamsMock,
}));
jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));
jest.mock('@/lib/keycloakClient', () => ({
  exchangeCode: jest.fn(() =>
    Promise.resolve({
      access_token: 'tok', expires_in: 300,
    }),
  ),
}));
jest.mock('@/lib/keycloakSession', () => ({
  registerSession: jest.fn(() => Promise.resolve()),
}));
jest.mock('@/lib/keycloakCookies', () => ({
  COOKIE: {
    access: 'kc-access', refresh: 'kc-refresh',
    state: 'kc-state', verifier: 'kc-verifier',
  },
  readCookie: jest.fn(() => null),
  writeCookie: jest.fn(),
  clearCookie: jest.fn(),
}));

import { renderHook } from '@testing-library/react';
import { useAuthCallback } from '../useAuthCallback';

describe('useAuthCallback', () => {
  beforeEach(() => {
    replaceMock.mockClear();
    searchParamsMock.get.mockReset();
  });

  it('redirects to login when code param is missing', () => {
    searchParamsMock.get.mockReturnValue(null);
    renderHook(() => useAuthCallback());
    expect(replaceMock).toHaveBeenCalledWith(
      expect.stringContaining('login?error=oidc'),
    );
  });

  it('does not redirect when code is present', () => {
    searchParamsMock.get.mockImplementation(
      (key: string) => key === 'code' ? 'auth-code' : null,
    );
    renderHook(() => useAuthCallback());
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
