/**
 * Shared types for AI RTK Query endpoints.
 * @module store/api/aiTypes
 */

/** Body for the step-suggestion mutation. */
export interface StepSuggestionBody {
  /** Human-readable title of the planner step. */
  step_title: string;
  /** Optional longer description of the step. */
  step_description?: string;
  /** Startup archetype slug from Redux. */
  startup_type?: string | null;
  /** Current stage slug from Redux. */
  stage?: string | null;
}

/** Response from the step-suggestion endpoint. */
export interface StepSuggestionResponse {
  /** AI-generated suggestion text. */
  suggestion: string;
}

/** Body for the risk-report mutation. */
export interface RiskReportBody {
  /** Startup archetype slug. */
  startup_type?: string | null;
  /** Stage slug. */
  stage?: string | null;
  /** List of completed planner step IDs. */
  planner_completed_steps?: string[];
  /** Number of validated hypotheses. */
  hypotheses_validated?: number;
  /** Runway in months. */
  burn_months?: number;
}

/** Response from the risk-report endpoint. */
export interface RiskReportResponse {
  /** Risk analysis text (numbered list). */
  risks: string;
  /** ISO generation timestamp. */
  generated_at: string;
}

/** Supported document type slugs. */
export type DocumentType =
  | 'pitch_deck'
  | 'investor_update'
  | 'nda'
  | 'job_description';

/** Body for the draft-document mutation. */
export interface DraftDocumentBody {
  /** Document type to generate. */
  document_type: DocumentType;
  /** Startup display name. */
  startup_name?: string;
  /** Startup archetype slug. */
  startup_type?: string | null;
  /** Stage slug. */
  stage?: string | null;
  /** Optional extra context. */
  description?: string;
}

/** Response from the draft-document endpoint. */
export interface DraftDocumentResponse {
  /** The document type that was generated. */
  document_type: DocumentType;
  /** Generated document content. */
  content: string;
  /** ISO generation timestamp. */
  generated_at: string;
}
