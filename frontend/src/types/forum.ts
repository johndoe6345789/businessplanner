/**
 * Forum domain type definitions.
 * @module types/forum
 */

/** A forum board (category). */
export interface ForumBoard {
  /** Unique URL-safe board identifier. */
  slug: string;
  /** Human-readable board name. */
  label: string;
  /** Short description of the board. */
  description: string;
  /** Material icon name for this board. */
  icon: string;
  /** Display order (ascending). */
  sort_order: number;
}

/** A forum thread (top-level post). */
export interface ForumThread {
  /** Thread ID. */
  id: string;
  /** Thread subject line. */
  title: string;
  /** Opening post body. */
  content: string;
  /** Board this thread belongs to. */
  board_slug: string;
  /** UUID of the author. */
  author_id: string;
  /** Display name of the author. */
  author_name: string;
  /** Total reply count. */
  post_count: number;
  /** ISO-8601 creation timestamp. */
  created_at: string;
}

/** A single post (reply) inside a thread. */
export interface ForumPost {
  /** Post ID. */
  id: string;
  /** Parent thread ID. */
  thread_id: string;
  /** Post body. */
  content: string;
  /** UUID of the author. */
  author_id: string;
  /** Display name of the author. */
  author_name: string;
  /** ISO-8601 creation timestamp. */
  created_at: string;
  /** Number of active flag reports. */
  flag_count: number;
  /** Whether a moderator has hidden this post. */
  hidden: boolean;
}
