#pragma once
/**
 * @file equity_vesting_schedule.h
 * @brief Schedule-building helper for the
 *        vesting calculator.
 */

#include "legal_types.h"
#include <cmath>

namespace services::legal_team
{

/**
 * @brief Build the sampled vesting schedule.
 *        Includes month 0, cliff month, every
 *        3rd month after the cliff, and the
 *        final vesting month.
 * @param cliff         Cliff in months.
 * @param vesting       Total vesting months.
 * @param cliffShares   Shares vested at cliff.
 * @param total         Total shares to vest.
 * @param monthlyVestD  Fractional shares/month
 *                      post-cliff.
 * @return JSON array of schedule entries.
 */
inline auto buildSchedule(
    int cliff,
    int vesting,
    long long cliffShares,
    long long total,
    double monthlyVestD) -> json
{
    json sched = json::array();
    sched.push_back(
        {{"month", 0},
         {"cumulativeVested", 0}});

    if (cliff > 0) {
        sched.push_back(
            {{"month", cliff},
             {"cumulativeVested",
              cliffShares}});
    }

    for (int m = cliff + 3;
         m < vesting; m += 3) {
        long long cum = cliffShares
            + static_cast<long long>(
                  std::round(
                      static_cast<double>(
                          m - cliff)
                      * monthlyVestD));
        sched.push_back(
            {{"month", m},
             {"cumulativeVested", cum}});
    }

    sched.push_back(
        {{"month", vesting},
         {"cumulativeVested", total}});
    return sched;
}

} // namespace services::legal_team
