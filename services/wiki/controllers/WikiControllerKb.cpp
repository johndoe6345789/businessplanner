/**
 * @file WikiControllerKb.cpp
 * @brief GET /api/wiki/kb — filtered knowledge-base
 *        page listing.
 */

#include "WikiController.h"
#include "wiki/backend/WikiStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

using services::wiki::WikiStore;

void WikiController::listKbPages(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto param =
        [&](const std::string& key)
        -> std::optional<std::string> {
            auto v = req->getParameter(key);
            if (v.empty()) return std::nullopt;
            return v;
        };

    WikiStore store;
    store.listKbPages(
        param("startup_type"),
        param("stage"),
        param("kb_type"),
        [cb](const services::wiki::json& d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
