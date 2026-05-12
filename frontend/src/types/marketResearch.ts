/**
 * Market research domain types.
 * @module types/marketResearch
 */

/** Raw inputs for TAM/SAM/SOM computation. */
export interface TamInputs {
  /** Total addressable market in USD. */
  totalMarketUsd: number;
  /** Percentage of TAM that is the target segment. */
  targetSegmentPct: number;
  /** Percentage of SAM that is reachable. */
  reachablePct: number;
  /** Optional free-text notes. */
  notes: string;
}

/** Computed TAM/SAM/SOM result derived from TamInputs. */
export interface TamResult {
  /** Total addressable market (same as totalMarketUsd). */
  tam: number;
  /** Serviceable addressable market: tam × targetSegmentPct/100. */
  sam: number;
  /** Serviceable obtainable market: sam × reachablePct/100. */
  som: number;
}

/** A tracked competitor entry. */
export interface Competitor {
  /** Unique identifier. */
  id: string;
  /** Owning user identifier. */
  userId: string;
  /** Company name. */
  name: string;
  /** Company website URL. */
  website: string;
  /** Company stage (e.g. early, growth, enterprise). */
  stage: string;
  /** List of competitor strengths. */
  strengths: string[];
  /** List of competitor weaknesses. */
  weaknesses: string[];
  /** Feature comparison map. */
  features: Record<string, boolean>;
  /** Free-text notes. */
  notes: string;
}

/** Input payload for creating a competitor. */
export interface CreateCompetitorInput {
  /** Company name. */
  name: string;
  /** Company website URL. */
  website: string;
  /** Company stage. */
  stage: string;
  /** List of competitor strengths. */
  strengths: string[];
  /** List of competitor weaknesses. */
  weaknesses: string[];
  /** Feature comparison map. */
  features: Record<string, boolean>;
  /** Free-text notes. */
  notes: string;
}

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

/** A single customer discovery / interview log entry. */
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
  /** Assumptions validated during this session. */
  validatedAssumptions: string[];
  /** Assumptions invalidated during this session. */
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
  /** Assumptions validated during this session. */
  validatedAssumptions: string[];
  /** Assumptions invalidated during this session. */
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
