const dispatchMock = jest.fn();
const parseJwtMock = jest.fn();
const readCookieMock = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
}));
jest.mock('@/store/slices/authSlice', () => ({
  setCredentials: (p: unknown) => ({
    type: 'auth/setCredentials', payload: p,
  }),
  initComplete: () => ({ type: 'auth/initComplete' }),
}));
jest.mock('@/lib/keycloakClient', () => ({
  parseJwt: (tok: string) => parseJwtMock(tok),
}));
jest.mock('@/lib/keycloakCookies', () => ({
  COOKIE: { access: 'kc-access' },
  readCookie: (key: string) => readCookieMock(key),
}));

import { renderHook } from '@testing-library/react';
import { useInitAuth } from '../useInitAuth';

describe('useInitAuth', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    readCookieMock.mockReturnValue(null);
  });

  it('dispatches initComplete when no token cookie', () => {
    renderHook(() => useInitAuth());
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'auth/initComplete',
      }),
    );
  });

  it('does not dispatch setCredentials without a token', () => {
    renderHook(() => useInitAuth());
    const calls = dispatchMock.mock.calls.flat();
    const types = calls.map(
      (c) => (c as { type: string }).type,
    );
    expect(types).not.toContain('auth/setCredentials');
  });

  it('dispatches setCredentials with user role from JWT', () => {
    readCookieMock.mockReturnValue('token.payload.sig');
    parseJwtMock.mockReturnValue({
      sub: 'u1', email: 'a@b.com',
      preferred_username: 'alice',
      realm_access: { roles: ['admin'] },
    });
    renderHook(() => useInitAuth());
    const setCall = dispatchMock.mock.calls
      .flat()
      .find((c) => (c as { type: string }).type
        === 'auth/setCredentials');
    expect(setCall).toBeDefined();
    expect(
      (setCall as { payload: { user: { role: string } } })
        .payload.user.role,
    ).toBe('admin');
  });
});
