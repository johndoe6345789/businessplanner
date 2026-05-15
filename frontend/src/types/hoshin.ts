/**
 * @file hoshin.ts
 * @brief TypeScript types for the Hoshin Kanri domain.
 */

/** Objective time-horizon level. */
export type HoshinHorizon =
  | 'vision'
  | 'breakthrough'
  | 'annual';

/** X-matrix link strength. */
export type HoshinStrength =
  | 'strong'
  | 'medium'
  | 'weak';

/**
 * @brief A single Hoshin Kanri objective row.
 */
export interface HoshinObjective {
  id: string;
  user_id: string;
  title: string;
  description: string;
  horizon: HoshinHorizon;
  target_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * @brief A link between an objective and a startup.
 */
export interface HoshinLink {
  id: string;
  objective_id: string;
  organisation_id: string;
  strength: HoshinStrength;
}

/**
 * @brief Request body for creating an objective.
 */
export interface CreateObjectiveInput {
  title: string;
  description: string;
  horizon: HoshinHorizon;
  target_date?: string;
  sort_order?: number;
}

/**
 * @brief Request body for creating a link.
 */
export interface CreateLinkInput {
  objective_id: string;
  organisation_id: string;
  strength: HoshinStrength;
}
