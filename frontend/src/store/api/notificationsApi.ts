/**
 * Notifications RTK Query endpoints.
 * @module store/api/notificationsApi
 */
import { baseApi } from './baseApi';
import type {
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
} from '@/types/notifications';
import apiConstants from '@/constants/api.json';
import notifConstants
  from '@/constants/notifications.json';
export type { ListNotificationsArgs }
  from './notificationsApi.types';
import type { ListNotificationsArgs }
  from './notificationsApi.types';

const urls = apiConstants.notifications;

/** Notifications endpoints injected into baseApi. */
export const notificationsApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /**
       * Fetch a paginated notification list.
       * @param args - Pagination params.
       */
      listNotifications: build.query<
        NotificationListResponse, ListNotificationsArgs
      >({
        query: ({ page = 1, per_page = 20 } = {}) => ({
          url: urls.list,
          params: { page, per_page },
        }),
        providesTags: ['Notification'],
      }),

      /**
       * Poll the unread notification count.
       * @returns Current unread count.
       */
      getUnreadCount: build.query<
        UnreadCountResponse, void
      >({
        query: () => urls.unreadCount,
        providesTags: ['Notification'],
        keepUnusedDataFor:
          notifConstants.POLL_INTERVAL_MS / 1000,
      }),

      /**
       * Mark a single notification as read.
       * @param id - Notification identifier.
       */
      markNotificationRead: build.mutation<
        Notification, string
      >({
        query: (id) => ({
          url: urls.markRead.replace(':id', id),
          method: 'PATCH',
        }),
        invalidatesTags: ['Notification'],
      }),

      /** Mark all notifications as read. */
      markAllRead: build.mutation<void, void>({
        query: () => ({
          url: urls.markAllRead,
          method: 'POST',
        }),
        invalidatesTags: ['Notification'],
      }),

      /**
       * Delete a notification.
       * @param id - Notification identifier.
       */
      deleteNotification: build.mutation<void, string>({
        query: (id) => ({
          url: urls.delete.replace(':id', id),
          method: 'DELETE',
        }),
        invalidatesTags: ['Notification'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
