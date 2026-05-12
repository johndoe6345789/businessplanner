/**
 * @file CompetitorController.cpp
 * @brief GET + POST for /api/market-research/competitors
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

void MarketResearchController::listCompetitors(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "listCompetitors userId={}", userId);

    competitors_.listCompetitors(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "listCompetitors error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void MarketResearchController::createCompetitor(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "invalid JSON body"));
        return;
    }

    competitors_.createCompetitor(
        userId, body,
        [cb](const json& data) {
            cb(::utils::jsonCreated(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "createCompetitor error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
