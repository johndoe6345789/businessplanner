/**
 * @file GamificationEvents.cpp
 * @brief POST /api/gamification/events/step-complete
 *
 * Records planner step completion: awards points,
 * updates streak, then checks for new badges.
 */

#include "GamificationController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void GamificationController::stepComplete(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");

    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded()
        || !body.contains("step_id")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "step_id required"));
        return;
    }
    auto stepId =
        body["step_id"].get<std::string>();
    spdlog::debug(
        "stepComplete userId={} step={}",
        userId, stepId);

    svc_.awardPoints(
        userId, pointsPerStep_,
        "planner_step_complete", "planner",
        [this, userId, stepId, cb](const json& pts) {
            svc_.updateStreak(
                userId,
                [this, userId, pts, cb](
                    const json& streak) {
                    svc_.checkAndAwardBadges(
                        userId,
                        [pts, streak, cb](
                            const json& badges) {
                            cb(::utils::jsonOk({
                                {"ok", true},
                                {"points", pts},
                                {"streak", streak},
                                {"newBadges",
                                 badges},
                            }));
                        },
                        [cb](
                            drogon::HttpStatusCode c,
                            const std::string& m) {
                            spdlog::warn(
                                "badges err: {}",
                                m);
                            cb(::utils::jsonError(
                                c, m));
                        });
                },
                [cb](drogon::HttpStatusCode c,
                     const std::string& m) {
                    spdlog::warn(
                        "streak err: {}", m);
                    cb(::utils::jsonError(c, m));
                });
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            spdlog::warn("points err: {}", m);
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
