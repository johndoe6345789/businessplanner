/**
 * @file streak_service_read.cpp
 * @brief Read-only streak query implementation.
 */

#include "streaks/backend/StreakService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void StreakService::getStreak(
    const std::string& userId,
    Callback onSuccess,
    ErrCallback onError)
{
    const std::string sql = R"(
        SELECT current_streak, longest_streak
        FROM streaks
        WHERE user_id = $1
    )";

    auto dbClient = db();
    *dbClient << sql << userId >>
        [onSuccess](const Result& r) {
            if (r.empty()) {
                onSuccess({{"currentStreak", 0},
                           {"longestStreak", 0}});
                return;
            }
            auto cur =
                r[0]["current_streak"]
                    .as<std::int32_t>();
            auto lng =
                r[0]["longest_streak"]
                    .as<std::int32_t>();
            onSuccess({{"currentStreak", cur},
                       {"longestStreak", lng}});
        } >>
        [onError](const DrogonDbException& e) {
            spdlog::error(
                "getStreak DB error: {}",
                e.base().what());
            onError(k500InternalServerError,
                    "Internal server error");
        };
}

} // namespace services
