const refreshMock = jest.fn();
const registerSessionMock = jest.fn();
const readCookieMock = jest.fn();
const writeCookieMock = jest.fn();

jest.mock('@/lib/keycloakClient', () => ({
  refresh: (rt: string) => refreshMock(rt),
}));
jest.mock('@/lib/keycloakSession', () => ({
  registerSession: (tok: string) =>
    registerSessionMock(tok),
}));
jest.mock('@/lib/keycloakCookies', () => ({
  COOKIE: { access: 'kc-access', refresh: 'kc-refresh' },
  readCookie: (key: string) => readCookieMock(key),
  writeCookie: (...args: unknown[]) =>
    writeCookieMock(...args),
}));
jest.mock('@/constants/keycloak.json', () => ({
  refreshLeadSeconds: 30,
}), { virtual: true });

import { renderHook, act } from '@testing-library/react';
import {
  useKeycloakRefresh,
} from '../useKeycloakRefresh';

describe('useKeycloakRefresh', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    readCookieMock.mockReturnValue('refresh-tok');
    refreshMock.mockResolvedValue({
      access_token: 'new-tok', expires_in: 300,
    });
    registerSessionMock.mockResolvedValue({});
  });

  afterEach(() => { jest.useRealTimers(); });

  it('does nothing when expiresAtMs is null', () => {
    renderHook(() =>
      useKeycloakRefresh(null, jest.fn()),
    );
    jest.advanceTimersByTime(60000);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('schedules refresh near expiry and updates token', async () => {
    const setAccess = jest.fn();
    const expiresAtMs = Date.now() + 40000;
    renderHook(() =>
      useKeycloakRefresh(expiresAtMs, setAccess),
    );
    await act(async () => {
      jest.advanceTimersByTime(15000);
      await Promise.resolve();
    });
    expect(refreshMock).toHaveBeenCalled();
    expect(setAccess).toHaveBeenCalledWith('new-tok');
  });

  it('calls setAccess(null) when refresh fails', async () => {
    refreshMock.mockRejectedValue(new Error('expired'));
    const setAccess = jest.fn();
    const expiresAtMs = Date.now() + 40000;
    renderHook(() =>
      useKeycloakRefresh(expiresAtMs, setAccess),
    );
    await act(async () => {
      jest.advanceTimersByTime(15000);
      await Promise.resolve();
    });
    expect(setAccess).toHaveBeenCalledWith(null);
  });
});
