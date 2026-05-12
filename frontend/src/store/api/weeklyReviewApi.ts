/**
 * Weekly Review RTK Query endpoints.
 * @module store/api/weeklyReviewApi
 */
import { baseApi } from './baseApi';
import type {
  WeeklyReview,
  WeeklyReviewFormData,
} from '@/types/weeklyReview';
import apiConstants from '@/constants/api.json';

/** Weekly Review API endpoints injected into baseApi. */
export const weeklyReviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Fetch the last 12 weekly reviews for the user. */
    listReviews: build.query<WeeklyReview[], void>({
      query: () => apiConstants.weeklyReview.list,
      providesTags: ['WeeklyReview'],
    }),

    /**
     * Fetch the current week's review if it exists.
     * Returns null when no review has been submitted yet.
     */
    getThisWeek: build.query<
      WeeklyReview | null,
      void
    >({
      query: () =>
        apiConstants.weeklyReview.thisWeek,
      providesTags: ['WeeklyReview'],
    }),

    /**
     * Submit (upsert) the current week's review.
     * Call completeStep('weekly_review') after success
     * to maintain the founder streak (done in hook).
     */
    submitReview: build.mutation<
      WeeklyReview,
      WeeklyReviewFormData
    >({
      query: (data) => ({
        url: apiConstants.weeklyReview.submit,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WeeklyReview'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListReviewsQuery,
  useGetThisWeekQuery,
  useSubmitReviewMutation,
} = weeklyReviewApi;
