'use client';

/**
 * @file useStartupComparison.ts
 * @brief Aggregates per-company risk profiles
 *        for the startup comparison page.
 */
import { useMemo } from 'react';
import {
  useListRisksQuery,
} from '@/store/api/riskAssessmentApi';
import {
  useListOrganisationsQuery,
} from '@/store/api/organisationsApi';
import {
  RISK_CATEGORIES, toRiskLevel,
} from './startupCompareUtils';
export type {
  RiskLevel, CategoryScore, StartupRiskProfile,
} from './startupCompareUtils';

/**
 * Fetches all risks + organisations and returns
 * per-company risk profiles sorted ascending
 * by totalScore (index 0 = best pick).
 *
 * @returns profiles array plus loading/error state.
 */
export function useStartupComparison() {
  const {
    data: risks = [],
    isLoading: rL, isError: rE,
  } = useListRisksQuery();
  const {
    data: orgs = [],
    isLoading: oL, isError: oE,
  } = useListOrganisationsQuery(undefined);

  const profiles = useMemo(() => {
    const linked = risks.filter(
      (r) => r.organisation_id,
    );
    const orgIds = [
      ...new Set(linked.map(
        (r) => r.organisation_id as string,
      )),
    ];
    return orgIds.flatMap((orgId) => {
      const org = orgs.find(
        (o) => o.id === orgId,
      );
      if (!org) return [];
      const mine = linked.filter(
        (r) => r.organisation_id === orgId,
      );
      const totalScore = mine.reduce(
        (s, r) => s + r.risk_score, 0,
      );
      const breakdown = RISK_CATEGORIES.map(
        (cat) => {
          const sub = mine.filter(
            (r) => r.category === cat,
          );
          return {
            category: cat,
            score: sub.reduce(
              (s, r) => s + r.risk_score, 0,
            ),
            count: sub.length,
          };
        },
      );
      return [{
        org, totalScore,
        riskCount: mine.length,
        breakdown,
        level: toRiskLevel(totalScore, mine.length),
      }];
    });
  }, [risks, orgs]);

  const sorted = useMemo(
    () => [...profiles].sort(
      (a, b) => a.totalScore - b.totalScore,
    ),
    [profiles],
  );

  return {
    profiles: sorted,
    isLoading: rL || oL,
    isError: rE || oE,
  };
}
