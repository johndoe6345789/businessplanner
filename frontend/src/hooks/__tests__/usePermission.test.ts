const selectorMock = jest.fn();
jest.mock('@/store/hooks', () => ({
  useAppSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));

import { renderHook } from '@testing-library/react';
import {
  usePermission, hasRole,
} from '../usePermission';

describe('hasRole', () => {
  it('returns true for equal roles', () => {
    expect(hasRole('admin', 'admin')).toBe(true);
    expect(hasRole('user', 'user')).toBe(true);
  });

  it('returns true when current role exceeds required', () => {
    expect(hasRole('admin', 'guest')).toBe(true);
    expect(hasRole('moderator', 'user')).toBe(true);
  });

  it('returns false when current role is below required', () => {
    expect(hasRole('guest', 'user')).toBe(false);
    expect(hasRole('user', 'admin')).toBe(false);
  });
});

describe('usePermission', () => {
  it('defaults to guest when user is null', () => {
    selectorMock.mockReturnValue(null);
    const { result } = renderHook(() => usePermission());
    expect(result.current.role).toBe('guest');
    expect(result.current.isAdmin).toBe(false);
  });

  it('exposes the user role from state', () => {
    selectorMock.mockReturnValue({ role: 'moderator' });
    const { result } = renderHook(() => usePermission());
    expect(result.current.role).toBe('moderator');
  });

  it('can() returns true for sufficient role', () => {
    selectorMock.mockReturnValue({ role: 'admin' });
    const { result } = renderHook(() => usePermission());
    expect(result.current.can('moderator')).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  it('can() returns false for insufficient role', () => {
    selectorMock.mockReturnValue({ role: 'user' });
    const { result } = renderHook(() => usePermission());
    expect(result.current.can('admin')).toBe(false);
  });
});
