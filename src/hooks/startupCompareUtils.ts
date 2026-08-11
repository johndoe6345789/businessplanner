/**
 * @file startupCompareUtils.ts
 * @brief Types and pure helpers for startup
 *        risk comparison aggregation.
 */
import type { RiskCategory }
  from '@/types/riskAssessment';
import type { Organisation }
  from '@/types/organisations';

/** Colour-coded risk band. */
export type RiskLevel =
  | 'low' | 'medium' | 'high' | 'critical';

/** Per-category score breakdown. */
export interface CategoryScore {
  category: RiskCategory;
  score: number;
  count: number;
}

/** Aggregated risk profile for one company. */
export interface StartupRiskProfile {
  org: Organisation;
  totalScore: number;
  riskCount: number;
  breakdown: CategoryScore[];
  level: RiskLevel;
}

export const RISK_CATEGORIES: RiskCategory[] = [
  'market', 'financial', 'operational',
  'legal', 'technical',
];

/**
 * Maps average risk score to a risk band.
 * @param total - Sum of risk_score values.
 * @param count - Number of risks.
 * @returns Risk level label.
 */
export function toRiskLevel(
  total: number, count: number,
): RiskLevel {
  if (!count) return 'low';
  const avg = total / count;
  if (avg <= 4)  return 'low';
  if (avg <= 9)  return 'medium';
  if (avg <= 15) return 'high';
  return 'critical';
}
