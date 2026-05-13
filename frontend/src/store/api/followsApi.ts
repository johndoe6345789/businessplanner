/**
 * Social follows RTK Query endpoints.
 * @module store/api/followsApi
 */
import { baseApi } from './baseApi';
import apiConstants from '@/constants/api.json';

/** A lightweight user reference returned by follows. */
export interface FollowUser {
  /** User UUID. */
  id: string;
  /** Display name. */
  display_name: string;
  /** Optional avatar URL. */
  avatar_url?: string;
}

/** Follows API endpoints. */
export const followsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Follow a user.
     * @param userId - UUID of user to follow.
     */
    follow: build.mutation<void, string>({
      query: (userId) => ({
        url: apiConstants.follows.follow.replace(
          ':user', userId),
        method: 'POST',
      }),
      invalidatesTags: ['Follows'],
    }),

    /**
     * Unfollow a user.
     * @param userId - UUID of user to unfollow.
     */
    unfollow: build.mutation<void, string>({
      query: (userId) => ({
        url: apiConstants.follows.follow.replace(
          ':user', userId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Follows'],
    }),

    /**
     * Get the list of users a user is following.
     * @param userId - UUID of user to query.
     */
    getFollowing: build.query<FollowUser[], string>({
      query: (userId) =>
        apiConstants.follows.following.replace(
          ':user', userId),
      providesTags: ['Follows'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFollowMutation,
  useUnfollowMutation,
  useGetFollowingQuery,
} = followsApi;
