/**
 * @file equity_vesting.cpp
 * @brief Founder vesting schedule calculator.
 */

#include "EquityService.h"
#include "equity_vesting_schedule.h"
#include <spdlog/spdlog.h>
#include <cmath>

namespace services::legal_team
{

void EquityService::calcVesting(
    const json& params,
    Callback ok,
    ErrCallback err)
{
    if (!params.is_object()) {
        err(drogon::k400BadRequest,
            "params must be a JSON object");
        return;
    }

    auto total =
        params.value("totalShares", 0LL);
    auto cliff =
        params.value("cliffMonths", 0);
    auto vesting =
        params.value("vestingMonths", 0);
    bool accel =
        params.value(
            "accelerationOnChange", false);

    if (total <= 0 || vesting <= 0
        || cliff < 0 || cliff > vesting) {
        spdlog::warn(
            "calcVesting: invalid parameters");
        err(drogon::k400BadRequest,
            "invalid vesting parameters");
        return;
    }

    long long cliffShares =
        static_cast<long long>(
            std::round(
                static_cast<double>(cliff)
                / static_cast<double>(vesting)
                * static_cast<double>(total)));

    int postCliff = vesting - cliff;
    long long remaining =
        total - cliffShares;
    double monthlyVestD = postCliff > 0
        ? static_cast<double>(remaining)
              / static_cast<double>(postCliff)
        : 0.0;
    long long monthlyVest =
        static_cast<long long>(
            std::round(monthlyVestD));

    auto schedule = buildSchedule(
        cliff, vesting,
        cliffShares, total, monthlyVestD);

    json result = {
        {"cliffShares", cliffShares},
        {"monthlyVest", monthlyVest},
        {"schedule", schedule}
    };

    if (accel) {
        result["accelerationNote"] =
            "Double-trigger acceleration "
            "applies on change of control";
    }

    ok(result);
}

} // namespace services::legal_team
