/**
 * TypeScript types for the accelerators domain.
 * @module types/accelerators
 */

/** Programme type options. */
export type ProgrammeType =
  | 'accelerator'
  | 'competition'
  | 'grant'
  | 'fellowship';

/** Application status options. */
export type AcceleratorStatus =
  | 'researching'
  | 'applying'
  | 'applied'
  | 'interviewing'
  | 'accepted'
  | 'rejected'
  | 'passed';

/**
 * An accelerator or competition programme record.
 */
export interface Accelerator {
  /** Unique identifier (UUID). */
  id: string;
  /** Programme name. */
  name: string;
  /** Type of programme. */
  programme_type: ProgrammeType;
  /** Programme website URL. */
  website: string;
  /** Application deadline (ISO date or null). */
  deadline: string | null;
  /** Current application status. */
  status: AcceleratorStatus;
  /** Free-form notes. */
  notes: string;
  /** Equity percentage offered (or null). */
  equity_pct: number | null;
  /** Funding in GBP offered (or null). */
  funding_gbp: number | null;
  /** ISO timestamp of creation. */
  created_at: string;
  /** ISO timestamp of last update. */
  updated_at: string;
  /** Linked organisation registry id, if any. */
  organisation_id?: string | null;
}

/**
 * Form data for creating or editing a programme.
 * Omits server-generated fields.
 */
export interface AcceleratorFormData
  extends Omit<
    Accelerator,
    'id' | 'created_at' | 'updated_at'
  > {}

/** Entry in the known-accelerators.json seed list. */
export interface KnownAccelerator {
  name: string;
  website: string;
  type: ProgrammeType;
}
