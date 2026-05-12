/**
 * Market research TAM/SAM/SOM types.
 * @module types/marketResearchTam
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

/** Computed TAM/SAM/SOM result from TamInputs. */
export interface TamResult {
  /** Total addressable market (= totalMarketUsd). */
  tam: number;
  /** Serviceable AM: tam × targetSegmentPct/100. */
  sam: number;
  /** Serviceable OM: sam × reachablePct/100. */
  som: number;
}
