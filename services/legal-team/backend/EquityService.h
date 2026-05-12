#pragma once
/**
 * @file EquityService.h
 * @brief Stateless calculators for equity split
 *        and founder vesting schedules.
 */

#include "legal_types.h"

namespace services::legal_team
{

/**
 * @brief Pure-computation service for equity
 *        calculations. No database access.
 */
class EquityService
{
  public:
    /**
     * @brief Calculate equity split across founders.
     * @param founders  JSON array of founder objects,
     *   each with name, role, timeCommitmentMonths,
     *   capitalContribution, ideaOriginator,
     *   priorExperience fields.
     * @param ok   Called with split result JSON.
     * @param err  Called on validation error.
     */
    void calcSplit(
        const json& founders,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Calculate a founder vesting schedule.
     * @param params  JSON object with totalShares,
     *   cliffMonths, vestingMonths,
     *   accelerationOnChange fields.
     * @param ok   Called with vesting result JSON.
     * @param err  Called on validation error.
     */
    void calcVesting(
        const json& params,
        Callback ok,
        ErrCallback err);
};

} // namespace services::legal_team
