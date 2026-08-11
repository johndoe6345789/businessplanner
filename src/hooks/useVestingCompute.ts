/**
 * Local vesting schedule computation hook.
 * Builds the schedule client-side so the UI updates
 * live without a backend round-trip.
 * @module hooks/useVestingCompute
 */
import { useMemo } from 'react';
import type {
  VestingScheduleEntry,
} from '@/types/legal';

/** Parameters accepted by useVestingCompute. */
export interface VestingComputeParams {
  /** Total share pool. */
  totalShares: number;
  /** Months before any vesting. */
  cliffMonths: number;
  /** Total vesting duration in months. */
  vestingMonths: number;
}

/** Return value of useVestingCompute. */
export interface VestingComputeResult {
  /** Shares vested at cliff. */
  cliffShares: number;
  /** Shares vested per month after cliff. */
  monthlyVest: number;
  /** Milestone rows: month 0, cliff, every 3rd,
   *  and final month. */
  schedule: VestingScheduleEntry[];
}

/**
 * Compute vesting schedule milestones.
 *
 * @param params - Vesting parameters.
 * @returns Computed schedule and summary values.
 */
export function useVestingCompute(
  params: VestingComputeParams,
): VestingComputeResult {
  return useMemo(() => {
    const { totalShares, cliffMonths,
      vestingMonths } = params;
    const postCliff = vestingMonths - cliffMonths;
    const monthly = postCliff > 0
      ? (totalShares - Math.round(
          totalShares * (cliffMonths / vestingMonths),
        )) / postCliff
      : 0;
    const cliff = Math.round(
      totalShares * (cliffMonths / vestingMonths),
    );

    const milestones = new Set<number>([
      0, cliffMonths, vestingMonths,
    ]);
    for (let m = cliffMonths + 3; m < vestingMonths;
      m += 3) {
      milestones.add(m);
    }

    const schedule: VestingScheduleEntry[] = Array
      .from(milestones)
      .sort((a, b) => a - b)
      .map((month) => {
        if (month === 0) return { month, cumulativeVested: 0 };
        if (month <= cliffMonths) {
          return { month, cumulativeVested: cliff };
        }
        const extra = Math.round(
          (month - cliffMonths) * monthly,
        );
        return {
          month,
          cumulativeVested: Math.min(
            cliff + extra, totalShares,
          ),
        };
      });

    return {
      cliffShares: cliff,
      monthlyVest: Math.round(monthly),
      schedule,
    };
  }, [params]);
}
