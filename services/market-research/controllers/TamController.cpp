/**
 * @file TamController.cpp
 * @brief GET + PUT /api/market-research/tam
 */

#include "MarketResearchController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void MarketResearchController::getTam(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug("getTam userId={}", userId);

    tam_.getTam(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn("getTam error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void MarketResearchController::saveTam(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug("saveTam userId={}", userId);

    auto bodyStr = req->getBody();
    auto body = json::parse(
        bodyStr, nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "invalid JSON body"));
        return;
    }

    tam_.saveTam(
        userId, body,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn("saveTam error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
