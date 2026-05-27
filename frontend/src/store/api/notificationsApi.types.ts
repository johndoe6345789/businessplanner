/**
 * Shared types for the Notifications RTK Query API.
 * @module store/api/notificationsApi.types
 */

/** Query args for the paginated list endpoint. */
export interface ListNotificationsArgs {
  /** 1-based page number. */
  page?: number;
  /** Items per page. */
  per_page?: number;
}
