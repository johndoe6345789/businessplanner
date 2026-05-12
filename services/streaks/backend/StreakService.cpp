/**
 * @file StreakService.cpp
 * @brief Implementation of StreakService.
 */

#include "streaks/backend/StreakService.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

StreakService::StreakService(std::vector<std::int32_t> milestones)
    : milestones_(std::move(milestones))
{
}

auto StreakService::db() -> DbClientPtr
{
    return drogon::app().getDbClient();
}

void StreakService::updateStreak(const std::string& userId, Callback onSuccess,
                                 ErrCallback onError)
{
    const std::string sql = R"(
        INSERT INTO streaks
            (user_id, current_streak,
             longest_streak, last_activity_date)
        VALUES ($1, 1, 1, CURRENT_DATE)
        ON CONFLICT (user_id) DO UPDATE
        SET current_streak = CASE
                WHEN streaks.last_activity_date
                     = CURRENT_DATE
                    THEN streaks.current_streak
                WHEN streaks.last_activity_date
                     = CURRENT_DATE - 1
                    THEN streaks.current_streak + 1
                ELSE 1
            END,
            longest_streak = GREATEST(
                streaks.longest_streak,
                CASE
                    WHEN streaks.last_activity_date
                         = CURRENT_DATE
                        THEN streaks.current_streak
                    WHEN streaks.last_activity_date
                         = CURRENT_DATE - 1
                        THEN streaks.current_streak + 1
                    ELSE 1
                END),
            last_activity_date = CURRENT_DATE
        RETURNING current_streak, longest_streak
    )";

    auto dbClient = db();
    *dbClient << sql << userId >> [this, onSuccess](const Result& r) {
        if (r.empty()) {
            onSuccess({{"currentStreak", 0},
                       {"longestStreak", 0},
                       {"milestoneReached", false},
                       {"milestoneValue", 0}});
            return;
        }
        auto cur = r[0]["current_streak"].as<std::int32_t>();
        auto lng = r[0]["longest_streak"].as<std::int32_t>();
        bool hit = false;
        std::int32_t hitVal = 0;
        for (auto m : milestones_) {
            if (cur == m) {
                hit = true;
                hitVal = m;
                break;
            }
        }
        onSuccess({{"currentStreak", cur},
                   {"longestStreak", lng},
                   {"milestoneReached", hit},
                   {"milestoneValue", hitVal}});
    } >> [onError](const DrogonDbException& e) {
        spdlog::error("updateStreak DB error: {}", e.base().what());
        onError(k500InternalServerError, "Internal server error");
    };
}

} // namespace services
