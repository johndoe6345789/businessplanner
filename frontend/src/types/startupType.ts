/**
 * Startup type domain types.
 * @module types/startupType
 */

/** A startup archetype shown during onboarding. */
export interface StartupType {
  /** URL-safe identifier. */
  slug: string;
  /** Human-readable display name. */
  name: string;
  /** Short description of this startup archetype. */
  description: string;
  /** Material icon name for the archetype. */
  icon: string;
  /** Display order in the selection list. */
  sortOrder: number;
}

/** A named stage within a startup type lifecycle. */
export interface StartupTypeStage {
  /** URL-safe identifier for the stage. */
  slug: string;
  /** Human-readable stage name. */
  name: string;
  /** Short description of this lifecycle stage. */
  description: string;
  /** Position in the ordered stage sequence. */
  displayOrder: number;
}

/**
 * Full startup type with stage list and known traps.
 * Returned by the detail endpoint.
 */
export interface StartupTypeFull extends StartupType {
  /** Ordered lifecycle stages for this startup type. */
  stages: StartupTypeStage[];
  /** Common pitfalls specific to this startup type. */
  traps: string[];
}
