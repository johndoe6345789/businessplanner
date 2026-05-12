/**
 * @file DiscoveryController.cpp
 * @brief GET, POST, DELETE /{id}
 *        for /api/market-research/discovery
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

void MarketResearchController::listDiscovery(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "listDiscovery userId={}", userId);

    discovery_.listEntries(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "listDiscovery error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void MarketResearchController::createDiscovery(
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

    discovery_.createEntry(
        userId, body,
        [cb](const json& data) {
            cb(::utils::jsonCreated(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "createDiscovery error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void MarketResearchController::deleteDiscovery(
    const drogon::HttpRequestPtr& req,
    Cb&& cb,
    std::string id)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "deleteDiscovery id={}", id);

    discovery_.deleteEntry(
        userId, id,
        [cb](const json&) {
            cb(::utils::jsonOk(json::object()));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "deleteDiscovery error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
