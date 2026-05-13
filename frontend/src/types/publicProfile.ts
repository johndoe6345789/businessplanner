/**
 * Public founder profile type.
 * @module types/publicProfile
 */

/**
 * Read-only public profile data returned by
 * GET /api/users/profile/{username}.
 */
export interface PublicProfile {
  /** URL-safe username. */
  username: string;
  /** Display name shown on the profile card. */
  displayName: string;
  /** Startup name entered during onboarding. */
  startupName: string;
  /** Startup archetype slug (e.g. "saas"). */
  startupType: string;
  /** Current lifecycle stage slug. */
  stage: string;
  /** Free-text biography. */
  bio: string;
  /** Whether the user is a registered mentor. */
  is_mentor: boolean;
  /** ISO-8601 account creation date. */
  joined_at: string;
  /** Total badges earned. */
  badge_count: number;
  /** Current activity streak in days. */
  current_streak: number;
}
