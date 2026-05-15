/**
 * @file OrgReadController.cpp
 * @brief GET + POST /api/organisations
 */

#include "OrgController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void OrgController::listOrgs(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    auto q = req->getOptionalParameter<
        std::string>("q");
    spdlog::debug(
        "listOrgs userId={}", userId);

    svc_.listOrgs(
        userId, q,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "listOrgs error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void OrgController::createOrg(
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

    svc_.createOrg(
        userId, body,
        [cb](const json& data) {
            cb(::utils::jsonCreated(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "createOrg error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
