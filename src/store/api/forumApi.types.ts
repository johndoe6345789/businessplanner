/**
 * Shared types for the Forum RTK Query API.
 * @module store/api/forumApi.types
 */
import type { ForumThread, ForumPost } from '@/types/forum';

/** Args for listing threads on a board. */
export interface ListThreadsArgs {
  board: string;
  page?: number;
}

/** Args for creating a new thread. */
export interface CreateThreadArgs {
  title: string;
  content: string;
  board_slug: string;
}

/** Thread detail response (thread + posts). */
export interface ThreadDetail {
  thread: ForumThread;
  posts: ForumPost[];
}

/** Paginated list of threads. */
export interface ThreadsPage {
  threads: ForumThread[];
  total: number;
}
