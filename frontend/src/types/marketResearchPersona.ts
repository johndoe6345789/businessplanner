/**
 * Market research Persona, Discovery, and BMC types.
 * @module types/marketResearchPersona
 */

/** A customer persona entry. */
export interface Persona {
  /** Unique identifier. */
  id: string;
  /** Owning user identifier. */
  userId: string;
  /** Persona display name. */
  name: string;
  /** Persona job role or title. */
  role: string;
  /** Key pain points. */
  painPoints: string[];
  /** Goals and motivations. */
  goals: string[];
  /** Free-text notes. */
  notes: string;
}

/** Input payload for creating a persona. */
export interface CreatePersonaInput {
  /** Persona display name. */
  name: string;
  /** Persona job role or title. */
  role: string;
  /** Key pain points. */
  painPoints: string[];
  /** Goals and motivations. */
  goals: string[];
  /** Free-text notes. */
  notes: string;
}

/** A single customer discovery / interview entry. */
export interface DiscoveryEntry {
  /** Unique identifier. */
  id: string;
  /** Owning user identifier. */
  userId: string;
  /** Name of the interviewee / contact. */
  contactName: string;
  /** ISO date string of the interview. */
  date: string;
  /** Key findings from the session. */
  keyFindings: string;
  /** Assumptions validated in this session. */
  validatedAssumptions: string[];
  /** Assumptions invalidated in this session. */
  invalidatedAssumptions: string[];
}

/** Input payload for creating a discovery entry. */
export interface CreateDiscoveryInput {
  /** Name of the interviewee / contact. */
  contactName: string;
  /** ISO date string of the interview. */
  date: string;
  /** Key findings from the session. */
  keyFindings: string;
  /** Assumptions validated in this session. */
  validatedAssumptions: string[];
  /** Assumptions invalidated in this session. */
  invalidatedAssumptions: string[];
}

/** Business Model Canvas / Lean Canvas data. */
export interface BmcCanvas {
  /** The core problem being solved. */
  problem: string;
  /** The proposed solution. */
  solution: string;
  /** Unique value proposition. */
  uvp: string;
  /** Distribution channels. */
  channels: string;
  /** Target customer segments. */
  customerSegments: string;
  /** Cost structure summary. */
  costStructure: string;
  /** Revenue streams summary. */
  revenueStreams: string;
  /** Key metrics for the business. */
  keyMetrics: string;
  /** Unfair advantage or moat. */
  unfairAdvantage: string;
}
