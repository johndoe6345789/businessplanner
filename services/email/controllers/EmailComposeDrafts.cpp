/// @file EmailComposeDrafts.cpp -- Draft routes.
#include "EmailComposeController.h"
#include "email/backend/EmailDraftService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>

#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void EmailComposeController::listDrafts(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");
    services::EmailDraftService svc;
    svc.listDrafts(
        userId,
        [cb](const auto& d) {
            cb(::utils::jsonOk(d));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void EmailComposeController::createDraft(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    services::EmailDraftService svc;
    svc.createDraft(
        userId, body,
        [cb](const auto& d) {
            cb(::utils::jsonCreated(d));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
