/**
 * @file riskAssessment.ts
 * @brief TypeScript types for the risk assessment domain.
 */

/** Risk category options. */
export type RiskCategory =
  | 'market'
  | 'financial'
  | 'operational'
  | 'legal'
  | 'technical';

/** Risk lifecycle status. */
export type RiskStatus =
  | 'open'
  | 'mitigating'
  | 'closed';

/** 1–5 probability or impact rating. */
export type RiskRating = 1 | 2 | 3 | 4 | 5;

/**
 * Single risk item returned by the API.
 */
export interface Risk {
  /** UUID of this risk. */
  id: string;
  /** UUID of the owning user. */
  user_id: string;
  /** Domain the risk belongs to. */
  category: RiskCategory;
  /** Short title for the risk. */
  title: string;
  /** Full description of the risk. */
  description: string;
  /** Likelihood of occurring (1 = rare, 5 = certain). */
  probability: RiskRating;
  /** Business impact if it occurs (1 = minor, 5 = critical). */
  impact: RiskRating;
  /** Computed: probability × impact (1–25). */
  risk_score: number;
  /** Plan to reduce or eliminate the risk. */
  mitigation_strategy: string;
  /** Person or role responsible for mitigation. */
  owner: string;
  /** Current lifecycle status. */
  status: RiskStatus;
  /** ISO timestamp of creation. */
  created_at: string;
  /** ISO timestamp of last update. */
  updated_at: string;
}

/**
 * Payload for creating a new risk.
 */
export interface CreateRiskInput {
  category: RiskCategory;
  title: string;
  description: string;
  probability: RiskRating;
  impact: RiskRating;
  mitigation_strategy: string;
  owner: string;
  status: RiskStatus;
}

/**
 * Payload for updating an existing risk.
 */
export interface UpdateRiskInput
  extends CreateRiskInput {
  id: string;
}
