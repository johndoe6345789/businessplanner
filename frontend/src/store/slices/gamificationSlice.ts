/**
 * Redux slice for local gamification UI state.
 * Server-authoritative data is always fetched fresh;
 * this slice is intentionally excluded from persist.
 * @module store/slices/gamificationSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { GamificationProgress } from '@/types/gamification';

/** Shape of the gamification slice state. */
interface GamificationState {
  /** Latest progress snapshot from the server. */
  progress: GamificationProgress | null;
  /** Whether the user has opted in to the leaderboard. */
  isOptedInToLeaderboard: boolean;
}

const initialState: GamificationState = {
  progress: null,
  isOptedInToLeaderboard: false,
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    /**
     * Store the latest progress snapshot from the API.
     * @param state - Current gamification state.
     * @param action - Progress payload from the server.
     */
    setProgress(
      state,
      action: PayloadAction<GamificationProgress>,
    ) {
      state.progress = action.payload;
    },

    /**
     * Update the user's leaderboard opt-in preference.
     * @param state - Current gamification state.
     * @param action - True to opt in, false to opt out.
     */
    setLeaderboardOptIn(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.isOptedInToLeaderboard = action.payload;
    },

    /** Clear all gamification state (e.g. on logout). */
    clearGamification(state) {
      state.progress = null;
      state.isOptedInToLeaderboard = false;
    },
  },
});

export const {
  setProgress,
  setLeaderboardOptIn,
  clearGamification,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
