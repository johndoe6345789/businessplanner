/**
 * @file CompetitorMutController.cpp
 * @brief PUT /{id} + DELETE /{id}
 *        for /api/market-research/competitors
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

void MarketResearchController::updateCompetitor(
    const drogon::HttpRequestPtr& req,
    Cb&& cb,
    std::string id)
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

    competitors_.updateCompetitor(
        userId, id, body,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "updateCompetitor error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void MarketResearchController::deleteCompetitor(
    const drogon::HttpRequestPtr& req,
    Cb&& cb,
    std::string id)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "deleteCompetitor id={}", id);

    competitors_.deleteCompetitor(
        userId, id,
        [cb](const json&) {
            cb(::utils::jsonOk(json::object()));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "deleteCompetitor error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
