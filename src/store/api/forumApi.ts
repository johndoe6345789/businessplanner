/**
 * Forum RTK Query endpoints (boards, threads, posts).
 * @module store/api/forumApi
 */
import { baseApi } from './baseApi';
import type {
  ForumBoard, ForumThread, ForumPost,
} from '@/types/forum';
import apiConstants from '@/constants/api.json';
export type {
  ListThreadsArgs,
  CreateThreadArgs,
  ThreadDetail,
  ThreadsPage,
} from './forumApi.types';
import type {
  ListThreadsArgs,
  CreateThreadArgs,
  ThreadDetail,
  ThreadsPage,
} from './forumApi.types';

/** Forum API endpoints. */
export const forumApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** List all forum boards. */
    listBoards: build.query<ForumBoard[], void>({
      query: () => apiConstants.forum.boards,
      providesTags: ['Forum'],
    }),
    /** List threads for a board (paginated). */
    listThreads: build.query<
      ThreadsPage, ListThreadsArgs
    >({
      query: ({ board, page = 1 }) =>
        `${apiConstants.forum.threads}` +
        `?board=${board}&page=${page}`,
      providesTags: ['Forum'],
    }),
    /** Get a single thread with all posts. */
    getThread: build.query<ThreadDetail, string>({
      query: (id) =>
        apiConstants.forum.thread.replace(':id', id),
      providesTags: ['Forum'],
    }),
    /** Create a new thread. */
    createThread: build.mutation<
      ForumThread, CreateThreadArgs
    >({
      query: (data) => ({
        url: apiConstants.forum.threads,
        method: 'POST', body: data,
      }),
      invalidatesTags: ['Forum'],
    }),
    /** Post a reply to a thread. */
    replyToThread: build.mutation<
      ForumPost, { id: string; content: string }
    >({
      query: ({ id, content }) => ({
        url: apiConstants.forum.posts.replace(
          ':id', id),
        method: 'POST', body: { content },
      }),
      invalidatesTags: ['Forum'],
    }),
    /** Flag a post for moderation. */
    flagContent: build.mutation<void, string>({
      query: (id) => ({
        url: apiConstants.forum.flag.replace(
          ':id', id),
        method: 'POST',
      }),
      invalidatesTags: ['Forum'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListBoardsQuery,
  useListThreadsQuery,
  useGetThreadQuery,
  useCreateThreadMutation,
  useReplyToThreadMutation,
  useFlagContentMutation,
} = forumApi;
