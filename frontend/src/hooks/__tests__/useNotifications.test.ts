const queryMock = jest.fn();
jest.mock('@/store/api/notificationsApi', () => ({
  useGetUnreadCountQuery: (
    _a: unknown, _opts: unknown,
  ) => queryMock(),
}));
jest.mock('@/constants/notifications.json', () => ({
  POLL_INTERVAL_MS: 30000,
}), { virtual: true });

import { renderHook } from '@testing-library/react';
import { useNotifications } from '../useNotifications';

describe('useNotifications', () => {
  it('returns 0 and loading true on first fetch', () => {
    queryMock.mockReturnValue({
      data: undefined, isLoading: true,
    });
    const { result } = renderHook(
      () => useNotifications(),
    );
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns unread count from query data', () => {
    queryMock.mockReturnValue({
      data: { count: 5 }, isLoading: false,
    });
    const { result } = renderHook(
      () => useNotifications(),
    );
    expect(result.current.unreadCount).toBe(5);
    expect(result.current.isLoading).toBe(false);
  });

  it('falls back to 0 when data has no count', () => {
    queryMock.mockReturnValue({
      data: {}, isLoading: false,
    });
    const { result } = renderHook(
      () => useNotifications(),
    );
    expect(result.current.unreadCount).toBe(0);
  });
});
