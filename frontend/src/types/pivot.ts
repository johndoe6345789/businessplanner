/**
 * TypeScript types for the pivot tracker domain.
 * @module types/pivot
 */

/**
 * A recorded pivot with original and new direction.
 */
export interface Pivot {
  /** Unique identifier (UUID). */
  id: string;
  /** The original idea or direction. */
  original_idea: string;
  /** The new direction after the pivot. */
  new_direction: string;
  /** Event that triggered the pivot. */
  trigger_event: string;
  /** Rationale behind the pivot decision. */
  rationale: string;
  /** Impact on the business plan. */
  plan_impact: string;
  /** ISO date of the pivot (YYYY-MM-DD). */
  pivoted_at: string;
  /** ISO timestamp of creation. */
  created_at: string;
}

/**
 * Form data for creating or editing a pivot.
 * Omits server-generated fields.
 */
export interface PivotFormData
  extends Omit<Pivot, 'id' | 'created_at'> {}
