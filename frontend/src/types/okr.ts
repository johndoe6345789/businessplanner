/**
 * @file okr.ts
 * @brief TypeScript types for the OKR domain.
 */

/** OKR objective lifecycle status. */
export type OkrObjectiveStatus =
  | 'active'
  | 'completed'
  | 'cancelled';

/** Key result progress status. */
export type KrStatus =
  | 'achieved'
  | 'on-track'
  | 'at-risk'
  | 'behind';

/**
 * A key result nested inside an objective.
 */
export interface KeyResult {
  /** UUID of this key result. */
  id: string;
  /** UUID of the parent objective. */
  objective_id: string;
  /** UUID of the owning user. */
  user_id: string;
  /** Display title. */
  title: string;
  /** Starting value at period open. */
  start_value: number;
  /** Current measured value. */
  current_value: number;
  /** Target value to achieve. */
  target_value: number;
  /** Unit label (e.g. "£", "%", "users"). */
  unit: string;
  /** Computed 0–100 progress percentage. */
  progress: number;
  /** Derived traffic-light status. */
  status: KrStatus;
}

/**
 * An OKR objective with nested key results.
 */
export interface OkrObjective {
  /** UUID of this objective. */
  id: string;
  /** UUID of the owning user. */
  user_id: string;
  /** Display title. */
  title: string;
  /** Optional description. */
  description: string;
  /** Quarter (1–4). */
  quarter: number;
  /** 4-digit year. */
  year: number;
  /** Lifecycle status. */
  status: OkrObjectiveStatus;
  /** Nested key results. */
  key_results: KeyResult[];
}

/**
 * Payload for creating an objective.
 */
export interface CreateOkrObjectiveInput {
  title: string;
  description?: string;
  quarter: number;
  year: number;
}

/**
 * Payload for adding a key result to an objective.
 */
export interface AddKeyResultInput {
  title: string;
  start_value: number;
  target_value: number;
  unit: string;
}

/**
 * Payload for updating the current value of a KR.
 */
export interface UpdateKeyResultInput {
  current_value: number;
}
