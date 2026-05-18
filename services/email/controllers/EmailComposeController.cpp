/// @file EmailComposeController.cpp -- Send route.
#include "EmailComposeController.h"
#include "email/backend/EmailComposeService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

#include <string>
#include <thread>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void EmailComposeController::sendEmail(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");
    auto body = json::parse(
        req->bodyData(),
        req->bodyData() + req->bodyLength(),
        nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Request body required"));
        return;
    }

    // Blocking SMTP must not run on the event loop.
    // Detached: any uncaught exception would kill
    // the process, so wrap in try/catch(...).
    std::thread([userId, body, cb]() {
        try {
            services::EmailComposeService svc;
            svc.sendEmail(
                userId, body,
                [cb](const auto& d) {
                    cb(::utils::jsonOk(d));
                },
                [cb](auto code,
                     const auto& msg) {
                    cb(::utils::jsonError(
                        code, msg));
                });
        } catch (const std::exception& e) {
            spdlog::error(
                "compose send: {}", e.what());
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "Send failed"));
        } catch (...) {
            spdlog::error(
                "compose send: unknown");
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "Send failed"));
        }
    }).detach();
}

} // namespace controllers
