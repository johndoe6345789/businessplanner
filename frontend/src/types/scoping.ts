/**
 * Types for the product scoping / ICE canvas domain.
 * @module types/scoping
 */

/** Status of a scoped feature in MVP planning. */
export type FeatureStatus =
  | 'in_mvp'
  | 'later'
  | 'cut'
  | 'considering';

/** A scoped feature with ICE scores. */
export interface ScopedFeature {
  id: string;
  title: string;
  description: string;
  /** Impact score 1-10. */
  impact: number;
  /** Confidence score 1-10. */
  confidence: number;
  /** Ease score 1-10. */
  ease: number;
  /** Computed by backend: impact × confidence × ease. */
  ice_score: number;
  status: FeatureStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Fields required to create or update a feature.
 * Excludes server-computed / server-assigned fields.
 */
export type ScopedFeatureFormData = Omit<
  ScopedFeature,
  'id' | 'ice_score' | 'created_at' | 'updated_at'
>;
