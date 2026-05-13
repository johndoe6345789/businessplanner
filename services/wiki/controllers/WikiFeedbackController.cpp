/**
 * @file WikiFeedbackController.cpp
 * @brief POST /api/wiki/kb/{id}/feedback
 *        GET  /api/wiki/kb/{id}/feedback-summary
 */

#include "WikiFeedbackController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace controllers
{

using json = nlohmann::json;

void WikiFeedbackController::submitFeedback(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    const std::string userId =
        req->getAttributes()->get<std::string>(
            "jwt_user_id");
    auto body = req->getJsonObject();
    if (!body || !body->isMember("helpful")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "helpful field required"));
        return;
    }
    const bool helpful = (*body)["helpful"].asBool();
    auto db = drogon::app().getDbClient();
    db->execSqlAsync(
        "INSERT INTO kb_feedback"
        " (page_id, user_id, helpful)"
        " VALUES ($1, $2, $3)"
        " ON CONFLICT (page_id, user_id)"
        " DO UPDATE SET helpful = EXCLUDED.helpful",
        [cb, helpful](const drogon::orm::Result&) {
            cb(::utils::jsonOk(
                json{{"helpful", helpful}}));
        },
        [cb](const drogon::orm::DrogonDbException& e) {
            spdlog::error("kb-feedback DB: {}",
                          e.base().what());
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "DB error"));
        },
        id, userId, helpful);
}

void WikiFeedbackController::getFeedbackSummary(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto db = drogon::app().getDbClient();
    db->execSqlAsync(
        "SELECT COUNT(*) FILTER (WHERE helpful)"
        "     AS helpful,"
        "       COUNT(*) FILTER (WHERE NOT helpful)"
        "     AS unhelpful"
        " FROM kb_feedback WHERE page_id = $1",
        [cb](const drogon::orm::Result& r) {
            int h = 0, u = 0;
            if (!r.empty()) {
                h = r[0]["helpful"].as<int>();
                u = r[0]["unhelpful"].as<int>();
            }
            cb(::utils::jsonOk(
                json{{"helpful",   h},
                     {"unhelpful", u}}));
        },
        [cb](const drogon::orm::DrogonDbException& e) {
            spdlog::error("kb-feedback summary: {}",
                          e.base().what());
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "DB error"));
        },
        id);
}

} // namespace controllers
