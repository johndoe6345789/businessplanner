/**
 * @file GamificationController.cpp
 * @brief Leaderboard and awardPoints handlers.
 *
 * listBadges is in GamificationBadges.cpp.
 * Streaks and progress are in GamificationProgress.cpp.
 * Step-complete event is in GamificationEvents.cpp.
 */

#include "GamificationController.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "drogon-host/backend/utils/parse_helpers.h"
#include "gamification_handlers.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void GamificationController::leaderboard(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto period = req->getParameter("period");
    auto limitStr = req->getParameter("limit");
    if (period.empty())
        period = "all";
    auto limit = static_cast<std::int32_t>(
        ::utils::safeStoll(limitStr, 20));
    spdlog::debug(
        "leaderboard period={} limit={}",
        period, limit);

    svc_.getLeaderboard(
        period, limit,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "leaderboard error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void GamificationController::awardPoints(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto role = req->attributes()
        ->get<std::string>("user_role");
    if (role != "admin") {
        cb(::utils::jsonError(
            drogon::k403Forbidden,
            "Admin access required"));
        return;
    }

    auto body = parseAwardBody(req);
    if (!body.has_value()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "user_id and points required"));
        return;
    }

    auto targetId =
        (*body)["user_id"].get<std::string>();
    auto pts =
        (*body)["points"].get<std::int64_t>();
    auto reason =
        body->value("reason", "admin_award");
    spdlog::debug(
        "awardPoints target={} pts={}",
        targetId, pts);

    svc_.awardPoints(
        targetId, pts, reason, "admin",
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "awardPoints error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
