/**
 * Types for the startupType Redux slice.
 * @module store/slices/startupTypeSlice.types
 */

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
export interface StartupTypeState {
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
