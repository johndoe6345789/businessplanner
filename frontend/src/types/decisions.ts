/**
 * TypeScript types for the decision log domain.
 * @module types/decisions
 */

/**
 * A recorded decision with full context.
 */
export interface Decision {
  /** Unique identifier (UUID). */
  id: string;
  /** Short title for the decision. */
  title: string;
  /** Background context for the decision. */
  context: string;
  /** Options that were considered. */
  options_considered: string;
  /** The decision that was made. */
  decision: string;
  /** Rationale behind the decision. */
  rationale: string;
  /** Linked planner step identifier. */
  planner_step_id: string;
  /** Observed or expected outcome. */
  outcome: string;
  /** ISO timestamp of creation. */
  created_at: string;
  /** ISO timestamp of last update. */
  updated_at: string;
}

/**
 * Form data for creating or editing a decision.
 * Omits server-generated fields.
 */
export interface DecisionFormData
  extends Omit<Decision,
    'id' | 'created_at' | 'updated_at'> {}
