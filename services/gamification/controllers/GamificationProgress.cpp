/**
 * @file GamificationProgress.cpp
 * @brief Progress and streaks handlers for
 *        GamificationController.
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

void GamificationController::myStreaks(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug("myStreaks userId={}", userId);

    svc_.getStreak(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "myStreaks error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void GamificationController::myProgress(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug("myProgress userId={}", userId);

    svc_.getUserProgress(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "myProgress error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
