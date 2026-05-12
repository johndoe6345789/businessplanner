/**
 * @file WikiControllerPageRead.cpp
 * @brief GET /api/wiki/pages/{id} handler.
 */

#include "WikiController.h"
#include "wiki/backend/WikiStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

using services::wiki::WikiStore;
using services::wiki::json;

void WikiController::getPage(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    WikiStore store;
    store.getPage(
        std::stoll(id),
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
