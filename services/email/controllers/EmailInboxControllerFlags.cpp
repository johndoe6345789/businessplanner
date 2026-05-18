/// @file EmailInboxControllerFlags.cpp
/// @brief read/star flag mutation handlers.
#include "EmailInboxController.h"
#include "email/backend/EmailInboxService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

/** @brief Defensive-parse the request JSON body. */
static auto parseBody(
    const drogon::HttpRequestPtr& req) -> json
{
    return json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
}

void EmailInboxController::markRead(
    const drogon::HttpRequestPtr& req,
    Cb&& cb, const std::string& id)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");
    auto body = parseBody(req);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Invalid JSON"));
        return;
    }
    bool isRead = body.value("isRead", true);

    services::EmailInboxService svc;
    svc.markRead(userId, id, isRead,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void EmailInboxController::toggleStar(
    const drogon::HttpRequestPtr& req,
    Cb&& cb, const std::string& id)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");
    auto body = parseBody(req);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Invalid JSON"));
        return;
    }
    bool isStarred =
        body.value("isStarred", true);

    services::EmailInboxService svc;
    svc.setStar(userId, id, isStarred,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
