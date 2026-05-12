/**
 * Redux slice for the user's selected startup type.
 * Persisted so the choice survives page refresh.
 * @module store/slices/startupTypeSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

/** Co-founder status chosen during onboarding. */
export type CoFounderStatus =
  | 'solo'
  | 'with-cofounders';

/** Payload for the combined onboarding data action. */
export interface OnboardingDataPayload {
  /** The startup's display name (max 60 chars). */
  startupName: string | null;
  /** Stage slug from the type's stages list. */
  selectedStage: string | null;
  /** Whether the user is solo or with co-founders. */
  coFounderStatus: CoFounderStatus | null;
  /** Slug of the user's biggest challenge. */
  biggestChallenge: string | null;
}

/** Shape of the startupType slice state. */
interface StartupTypeState {
  /** Slug of the selected startup archetype, or null. */
  selectedSlug: string | null;
  /** Whether the user has finished the onboarding flow. */
  onboardingComplete: boolean;
  /** The startup's display name (max 60 chars). */
  startupName: string | null;
  /** Stage slug chosen by the user during onboarding. */
  selectedStage: string | null;
  /** Whether the user is solo or has co-founders. */
  coFounderStatus: CoFounderStatus | null;
  /** Slug of the user's self-reported biggest challenge. */
  biggestChallenge: string | null;
}

const initialState: StartupTypeState = {
  selectedSlug: null,
  onboardingComplete: false,
  startupName: null,
  selectedStage: null,
  coFounderStatus: null,
  biggestChallenge: null,
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

    /**
     * Persist all four supplementary onboarding fields
     * in a single dispatch to avoid multiple re-renders.
     * @param state - Current startupType state.
     * @param action - Combined onboarding data payload.
     */
    setOnboardingData(
      state,
      action: PayloadAction<OnboardingDataPayload>,
    ) {
      const {
        startupName,
        selectedStage,
        coFounderStatus,
        biggestChallenge,
      } = action.payload;
      state.startupName = startupName;
      state.selectedStage = selectedStage;
      state.coFounderStatus = coFounderStatus;
      state.biggestChallenge = biggestChallenge;
    },

    /** Clear the selected type and all onboarding data. */
    clearStartupType(state) {
      state.selectedSlug = null;
      state.onboardingComplete = false;
      state.startupName = null;
      state.selectedStage = null;
      state.coFounderStatus = null;
      state.biggestChallenge = null;
    },
  },
});

export const {
  setStartupType,
  setOnboardingComplete,
  setOnboardingData,
  clearStartupType,
} = startupTypeSlice.actions;

export default startupTypeSlice.reducer;
