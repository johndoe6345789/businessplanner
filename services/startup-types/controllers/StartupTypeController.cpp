/**
 * @file StartupTypeController.cpp
 * @brief Implements GET /api/startup-types and
 *        GET /api/startup-types/:slug.
 */

#include "StartupTypeController.h"
#include "startup-types/backend/StartupTypeService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

using services::startup_types::StartupTypeService;

void StartupTypeController::listTypes(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    StartupTypeService svc;
    svc.listTypes(
        [cb](const services::startup_types::json& d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void StartupTypeController::getType(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& slug)
{
    StartupTypeService svc;
    svc.getType(
        slug,
        [cb](const services::startup_types::json& d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
