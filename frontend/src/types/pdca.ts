/**
 * @file pdca.ts
 * @brief TypeScript types for the PDCA cycle domain.
 */

/** The four PDCA phases, in order. */
export type PdcaPhaseKey =
  | 'plan'
  | 'do'
  | 'check'
  | 'act';

/** Lifecycle status of a full PDCA cycle. */
export type PdcaStatus =
  | 'in-progress'
  | 'completed';

/**
 * Content stored in each phase JSONB column.
 */
export interface PdcaPhase {
  /** Free-text notes for this phase. */
  notes: string;
  /** Whether the phase has been completed. */
  completed: boolean;
  /** ISO timestamp when the phase was completed. */
  completed_at: string | null;
}

/**
 * A single PDCA cycle returned by the API.
 */
export interface PdcaCycle {
  /** UUID of this cycle. */
  id: string;
  /** UUID of the owning user. */
  user_id: string;
  /** Display title. */
  title: string;
  /** Optional extended description. */
  description: string;
  /** Phase currently active. */
  current_phase: PdcaPhaseKey;
  /** Cycle lifecycle status. */
  status: PdcaStatus;
  plan_phase: PdcaPhase;
  do_phase: PdcaPhase;
  check_phase: PdcaPhase;
  act_phase: PdcaPhase;
  /** ISO timestamp of creation. */
  created_at: string;
  /** ISO timestamp of last update. */
  updated_at: string;
}

/**
 * Payload for creating a PDCA cycle.
 */
export interface CreatePdcaInput {
  title: string;
  description?: string;
}

/**
 * Payload for advancing/updating a single phase.
 */
export interface UpdatePdcaPhaseInput {
  phase: PdcaPhaseKey;
  notes: string;
  completed: boolean;
}
