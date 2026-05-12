/**
 * Redux slice for the user's selected startup type.
 * Persisted so the choice survives page refresh.
 * @module store/slices/startupTypeSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

/** Shape of the startupType slice state. */
interface StartupTypeState {
  /** Slug of the selected startup archetype, or null. */
  selectedSlug: string | null;
  /** Whether the user has finished the onboarding flow. */
  onboardingComplete: boolean;
}

const initialState: StartupTypeState = {
  selectedSlug: null,
  onboardingComplete: false,
};

const startupTypeSlice = createSlice({
  name: 'startupType',
  initialState,
  reducers: {
    /**
     * Set the user's chosen startup archetype.
     * @param state - Current startupType state.
     * @param action - Slug of the selected type.
     */
    setStartupType(
      state,
      action: PayloadAction<string>,
    ) {
      state.selectedSlug = action.payload;
    },

    /**
     * Mark whether onboarding has been completed.
     * @param state - Current startupType state.
     * @param action - True when onboarding is done.
     */
    setOnboardingComplete(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.onboardingComplete = action.payload;
    },

    /** Clear the selected type (e.g. on logout). */
    clearStartupType(state) {
      state.selectedSlug = null;
      state.onboardingComplete = false;
    },
  },
});

export const {
  setStartupType,
  setOnboardingComplete,
  clearStartupType,
} = startupTypeSlice.actions;

export default startupTypeSlice.reducer;
