/**
 * Notification domain types.
 * @module types/notifications
 */

/** HAL-style link on a notification resource. */
export interface NotificationLink {
  /** Relation name (e.g. "self", "action"). */
  rel: string;
  /** Absolute or relative URL. */
  href: string;
}

/** A single notification returned by the API. */
export interface Notification {
  /** Unique identifier. */
  id: string;
  /** Short headline shown in the bell panel. */
  title: string;
  /** Full notification body text. */
  body: string;
  /**
   * Category token (e.g. "achievement",
   * "system", "social").
   */
  type: string;
  /** Whether the user has read this item. */
  is_read: boolean;
  /** ISO-8601 creation timestamp. */
  created_at: string;
  /** Optional navigation links. */
  links?: NotificationLink[];
}

/** Paginated list response from GET /notifications. */
export interface NotificationListResponse {
  /** Page of notification items. */
  notifications: Notification[];
  /** Total notifications in the store. */
  total: number;
  /** Count of unread notifications. */
  unread: number;
}

/** Response from GET /notifications/unread-count. */
export interface UnreadCountResponse {
  /** Current unread notification count. */
  count: number;
}
