/**
 * Forum moderation RTK Query endpoints.
 * @module store/api/forumModerationApi
 */
import { baseApi } from './baseApi';
import type { ForumPost } from '@/types/forum';
import apiConstants from '@/constants/api.json';

/** Moderation endpoints injected into baseApi. */
export const forumModerationApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** List flagged content (admin). */
      listFlagged: build.query<ForumPost[], void>({
        query: () => apiConstants.forum.flagged,
        providesTags: ['Forum'],
      }),

      /** Hide a post (admin/mod). */
      hideContent: build.mutation<void, string>({
        query: (id) => ({
          url: apiConstants.forum.hide.replace(
            ':id', id),
          method: 'POST',
        }),
        invalidatesTags: ['Forum'],
      }),

      /** Clear all flags on a post (admin/mod). */
      clearFlags: build.mutation<void, string>({
        query: (id) => ({
          url: apiConstants.forum.clearFlags.replace(
            ':id', id),
          method: 'POST',
        }),
        invalidatesTags: ['Forum'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useListFlaggedQuery,
  useHideContentMutation,
  useClearFlagsMutation,
} = forumModerationApi;
