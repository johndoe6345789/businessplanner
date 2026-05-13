/**
 * @file EmailSequenceController.cpp
 * @brief Admin trigger-drip + opt-out implementation.
 */

#include "EmailSequenceController.h"
#include "email-sequences/backend/EmailSequenceService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace controllers
{

using json = nlohmann::json;

void EmailSequenceController::triggerDrip(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto body = req->getJsonObject();
    if (!body || !body->isMember("user_id")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "user_id required"));
        return;
    }

    const std::string userId =
        (*body)["user_id"].asString();

    // Sequence state lookup is done by a background
    // cron job in production; this endpoint is for
    // operator debugging only.
    spdlog::info(
        "email-seq: admin triggered drip for {}",
        userId);

    cb(::utils::jsonOk(
        json{{"triggered", true},
             {"user_id",   userId}}));
}

void EmailSequenceController::optOut(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    const std::string userId =
        req->getAttributes()->get<std::string>(
            "jwt_user_id");

    if (userId.empty()) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Unauthorized"));
        return;
    }

    auto db = drogon::app().getDbClient();
    db->execSqlAsync(
        "UPDATE email_sequence_state "
        "SET opted_out = TRUE "
        "WHERE user_id = $1",
        [cb](const drogon::orm::Result&) {
            cb(::utils::jsonOk(
                json{{"opted_out", true}}));
        },
        [cb](const drogon::orm::DrogonDbException& e) {
            spdlog::error(
                "email-seq opt-out DB error: {}",
                e.base().what());
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "DB error"));
        },
        userId);
}

} // namespace controllers
