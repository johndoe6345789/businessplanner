/**
 * Local equity split computation hook.
 * Mirrors the backend formula in
 * services/legal-team/constants.json so the
 * calculator updates live without a round-trip.
 * @module hooks/useEquityCompute
 */
import { useMemo } from 'react';
import type {
  FounderInput,
  EquitySplit,
} from '@/types/legal';

const ROLE_W: Record<FounderInput['role'], number> = {
  ceo: 40, cto: 35, cmo: 25, coo: 25, other: 20,
};
const EXP_W: Record<
  FounderInput['priorExperience'], number
> = { high: 15, medium: 10, low: 5 };
const MAX_TIME = 50;
const TIME_PER_MONTH = 1.5;
const MAX_CAPITAL = 20;
const CAPITAL_PER_1000 = 1;
const IDEA_W = 10;

/**
 * Compute equity splits from founder inputs.
 *
 * @param founders - Array of founder inputs.
 * @returns Array of equity splits and total score.
 */
export function useEquityCompute(
  founders: FounderInput[],
): { splits: EquitySplit[]; totalScore: number } {
  return useMemo(() => {
    if (founders.length === 0) {
      return { splits: [], totalScore: 0 };
    }

    const scores = founders.map((f) => {
      const role = ROLE_W[f.role];
      const time = Math.min(
        f.timeCommitmentMonths * TIME_PER_MONTH,
        MAX_TIME,
      );
      const capital = Math.min(
        (f.capitalContribution / 1000) * CAPITAL_PER_1000,
        MAX_CAPITAL,
      );
      const idea = f.ideaOriginator ? IDEA_W : 0;
      const exp = EXP_W[f.priorExperience];
      return role + time + capital + idea + exp;
    });

    const totalScore = scores.reduce(
      (a, b) => a + b, 0,
    );

    const splits: EquitySplit[] = founders.map(
      (f, i) => ({
        name: f.name || `Founder ${i + 1}`,
        score: Math.round(scores[i] * 10) / 10,
        equityPct: totalScore > 0
          ? Math.round(
              (scores[i] / totalScore) * 1000,
            ) / 10
          : 0,
      }),
    );

    return { splits, totalScore };
  }, [founders]);
}
