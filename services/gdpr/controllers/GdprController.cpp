/**
 * @file GdprController.cpp
 * @brief GdprController handler implementations.
 *        Extracts userId from JWT attributes, delegates
 *        to the appropriate service, and sends the
 *        HTTP response.
 */

#include "GdprController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void GdprController::exportData(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug("gdpr export userId={}", userId);

    export_.exportUserData(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn("gdpr export error: {}",
                         msg);
            cb(::utils::jsonError(code, msg));
        });
}

void GdprController::deleteAccount(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::info(
        "gdpr account deletion userId={}", userId);

    delete_.deleteAccount(
        userId,
        [cb](const json&) {
            json body = {
                {"deleted", true},
                {"message",
                 "Your account has been "
                 "permanently deleted."}
            };
            cb(::utils::jsonOk(body));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::error(
                "gdpr delete error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
