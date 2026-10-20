/**
 * Hook for polling the unread notification count.
 * @module hooks/useNotifications
 */
import {
  useGetUnreadCountQuery,
} from '@/store/api/notificationsApi';
import notifConstants
  from '@/constants/notifications.json';

/** Return value of useNotifications. */
export interface UseNotificationsReturn {
  /** Current count of unread notifications. */
  unreadCount: number;
  /** True while the first fetch is in flight. */
  isLoading: boolean;
}

/**
 * Polls the unread notification count every
 * POLL_INTERVAL_MS milliseconds.
 *
 * @returns Unread count and loading flag.
 */
export function useNotifications(): UseNotificationsReturn {
  const { data, isLoading } = useGetUnreadCountQuery(
    undefined,
    {
      pollingInterval:
        notifConstants.POLL_INTERVAL_MS,
    },
  );

  return {
    unreadCount: data?.count ?? 0,
    isLoading,
  };
}
