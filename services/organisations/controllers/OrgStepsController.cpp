/**
 * @file OrgStepsController.cpp
 * @brief GET /api/organisations/{id}/steps
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

void OrgController::listSteps(
    const drogon::HttpRequestPtr& req,
    Cb&& cb,
    std::string id)
{
    spdlog::debug("listSteps orgId={}", id);
    svc_.listSteps(
        id,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "listSteps error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
