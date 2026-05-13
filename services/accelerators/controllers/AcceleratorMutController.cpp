/**
 * @file AcceleratorMutController.cpp
 * @brief PUT /{id} + DELETE /{id}
 *        for /api/accelerators
 */

#include "AcceleratorController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void AcceleratorController::updateAccelerator(
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

    svc_.updateAccelerator(
        id, userId, body,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "updateAccelerator error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void AcceleratorController::deleteAccelerator(
    const drogon::HttpRequestPtr& req,
    Cb&& cb,
    std::string id)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "deleteAccelerator id={}", id);

    svc_.deleteAccelerator(
        id, userId,
        [cb](const json&) {
            cb(::utils::jsonOk(json::object()));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "deleteAccelerator error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
