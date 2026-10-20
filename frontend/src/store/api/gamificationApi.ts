/**
 * Gamification RTK Query endpoints.
 * @module store/api/gamificationApi
 */
import { baseApi } from './baseApi';
import type {
  GamificationProgress,
  MyStreaks,
  BadgeAward,
  LeaderboardEntry,
  LeaderboardPeriod,
} from '@/types/gamification';
import apiConstants from '@/constants/api.json';

/** Args for the leaderboard query. */
export interface LeaderboardArgs {
  /** Time-period filter. */
  period?: LeaderboardPeriod;
  /** Max entries to return. */
  limit?: number;
}

/** Response from the step-complete event endpoint. */
export interface StepCompleteResponse {
  /** True when the event was recorded. */
  success: boolean;
}

/** Build leaderboard query string. */
function leaderboardParams(
  period: LeaderboardPeriod,
  limit: number,
): string {
  const p = new URLSearchParams();
  p.set('period', period);
  p.set('limit', String(limit));
  return p.toString();
}

/** Gamification API endpoints injected into baseApi. */
export const gamificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Fetch the current user's full gamification progress. */
    getMyProgress: build.query<GamificationProgress, void>({
      query: () => apiConstants.gamification.progressMe,
      providesTags: ['Gamification'],
    }),

    /** Fetch the current user's streak details. */
    getMyStreaks: build.query<MyStreaks, void>({
      query: () => apiConstants.gamification.streaksMe,
      providesTags: ['Gamification'],
    }),

    /** Fetch all badge definitions available in the system. */
    getAllBadges: build.query<BadgeAward[], void>({
      query: () => apiConstants.gamification.badges,
      providesTags: ['Gamification'],
    }),

    /** Fetch the ranked leaderboard for a given period. */
    getLeaderboard: build.query<
      LeaderboardEntry[],
      LeaderboardArgs
    >({
      query: ({ period = 'all', limit = 20 }) =>
        `${apiConstants.gamification.leaderboard}?${leaderboardParams(period, limit)}`,
      providesTags: ['Gamification'],
    }),

    /** Record a completed roadmap step and award XP. */
    completeStep: build.mutation<
      StepCompleteResponse,
      string
    >({
      query: (stepId) => ({
        url: apiConstants.gamification.stepComplete,
        method: 'POST',
        body: { step_id: stepId },
      }),
      invalidatesTags: ['Gamification'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyProgressQuery,
  useGetMyStreaksQuery,
  useGetAllBadgesQuery,
  useGetLeaderboardQuery,
  useCompleteStepMutation,
} = gamificationApi;
