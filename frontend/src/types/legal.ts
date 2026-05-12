/**
 * Types for the Legal & Equity domain.
 * @module types/legal
 */

/** A founder's input for equity split calculation. */
export interface FounderInput {
  /** Display name of the founder. */
  name: string;
  /** Functional role of the founder. */
  role: 'ceo' | 'cto' | 'cmo' | 'coo' | 'other';
  /** Number of months committed full-time. */
  timeCommitmentMonths: number;
  /** Capital contributed in USD. */
  capitalContribution: number;
  /** Whether this founder originated the idea. */
  ideaOriginator: boolean;
  /** Prior relevant experience level. */
  priorExperience: 'high' | 'medium' | 'low';
}

/** A single founder's computed equity split. */
export interface EquitySplit {
  /** Founder display name. */
  name: string;
  /** Weighted score used for computation. */
  score: number;
  /** Equity percentage allocated. */
  equityPct: number;
}

/** Result of the equity split calculation. */
export interface EquitySplitResult {
  /** Array of per-founder splits. */
  splits: EquitySplit[];
  /** Sum of all founder scores. */
  totalScore: number;
}

/** Parameters for a vesting schedule calculation. */
export interface VestingParams {
  /** Total share pool for these founders. */
  totalShares: number;
  /** Months before any vesting occurs. */
  cliffMonths: number;
  /** Total vesting duration in months. */
  vestingMonths: number;
  /** Whether double-trigger acceleration applies. */
  accelerationOnChange: boolean;
}

/** A single row in the vesting schedule. */
export interface VestingScheduleEntry {
  /** Month number in the schedule. */
  month: number;
  /** Cumulative shares vested at this month. */
  cumulativeVested: number;
}

/** Result of the vesting schedule calculation. */
export interface VestingResult {
  /** Shares unlocked at cliff. */
  cliffShares: number;
  /** Shares unlocked each month after cliff. */
  monthlyVest: number;
  /** Full vesting schedule. */
  schedule: VestingScheduleEntry[];
  /** Optional note about acceleration clause. */
  accelerationNote?: string;
}
