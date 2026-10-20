const entries = [{
  id: '1', method: 'GET', url: '/api/test',
  status: 200, ts: 0,
}];
const clearMock = jest.fn();
const subscribeMock = jest.fn(() => () => {});
const selectorMock = jest.fn();

jest.mock('@/utils/debugStore', () => ({
  getDebugEntries: () => entries,
  subscribe: (...args: unknown[]) => subscribeMock(...args),
  clearDebugEntries: () => clearMock(),
}));
jest.mock('react-redux', () => ({
  useSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));

import { renderHook } from '@testing-library/react';
import { useDebugPanel } from '../useDebugPanel';

describe('useDebugPanel', () => {
  beforeEach(() => {
    selectorMock.mockReturnValue({
      isAuthenticated: true,
      role: 'admin',
      userId: 'u1',
    });
  });

  it('returns debug entries from the store', () => {
    const { result } = renderHook(
      () => useDebugPanel(),
    );
    expect(result.current.entries).toBe(entries);
  });

  it('returns auth state from redux', () => {
    const { result } = renderHook(
      () => useDebugPanel(),
    );
    expect(result.current.auth.isAuthenticated).toBe(true);
    expect(result.current.auth.role).toBe('admin');
  });

  it('exposes env from process.env', () => {
    const { result } = renderHook(
      () => useDebugPanel(),
    );
    expect(result.current.env).toHaveProperty('nodeEnv');
  });

  it('clear calls clearDebugEntries', () => {
    const { result } = renderHook(
      () => useDebugPanel(),
    );
    result.current.clear();
    expect(clearMock).toHaveBeenCalled();
  });
});
