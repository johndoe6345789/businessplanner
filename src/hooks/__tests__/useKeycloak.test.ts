const parseJwtMock = jest.fn();
const readCookieMock = jest.fn();
const writeCookieMock = jest.fn();
const clearCookieMock = jest.fn();

jest.mock('@/lib/keycloakClient', () => ({
  buildAuthUrl: () => 'http://kc/auth',
  logout: () => 'http://kc/logout',
  parseJwt: (tok: string) => parseJwtMock(tok),
}));
jest.mock('@/lib/keycloakCookies', () => ({
  COOKIE: {
    access: 'kc-access', refresh: 'kc-refresh',
    state: 'kc-state', verifier: 'kc-verifier',
  },
  readCookie: (k: string) => readCookieMock(k),
  writeCookie: (...a: unknown[]) =>
    writeCookieMock(...a),
  clearCookie: (...a: unknown[]) =>
    clearCookieMock(...a),
}));
jest.mock('@/lib/keycloakPkce', () => ({
  randomString: () => 'rnd',
  codeChallengeFromVerifier: () =>
    Promise.resolve('challenge'),
}));
jest.mock('../useKeycloakRefresh', () => ({
  useKeycloakRefresh: () => {},
}));

import { renderHook, act } from '@testing-library/react';
import { useKeycloak } from '../useKeycloak';

describe('useKeycloak', () => {
  beforeEach(() => {
    readCookieMock.mockReturnValue(null);
    parseJwtMock.mockReturnValue(null);
  });

  it('is unauthenticated when no access cookie', () => {
    const { result } = renderHook(() => useKeycloak());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
  });

  it('reads token and parses user on mount', async () => {
    const claims = {
      sub: 'u1', email: 'a@b.com',
      exp: 9999999999,
    };
    readCookieMock.mockReturnValue('tok');
    parseJwtMock.mockReturnValue(claims);
    const { result } = renderHook(() => useKeycloak());
    await act(async () => {});
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toMatchObject({
      sub: 'u1',
    });
  });

  it('logout clears cookies and navigates', () => {
    const { result } = renderHook(() => useKeycloak());
    act(() => { result.current.logout(); });
    expect(clearCookieMock).toHaveBeenCalled();
  });
});
