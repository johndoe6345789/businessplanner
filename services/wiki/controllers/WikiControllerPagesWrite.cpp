/**
 * @file WikiControllerPagesWrite.cpp
 * @brief Update + delete handlers for
 *        /api/wiki/pages.
 */

#include "WikiController.h"
#include "wiki/backend/WikiStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "search/events/SearchEventPublisher.h"

namespace controllers
{

using services::wiki::WikiStore;
using services::wiki::json;

static std::optional<std::string> optField(
    const json& body, const std::string& key)
{
    if (body.contains(key)
        && body[key].is_string()
        && !body[key].get<std::string>().empty())
        return body[key].get<std::string>();
    return std::nullopt;
}

void WikiController::updatePage(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Invalid JSON body"));
        return;
    }
    std::vector<std::string> tags;
    if (body.contains("tags")
        && body["tags"].is_array()) {
        for (const auto& t : body["tags"])
            if (t.is_string())
                tags.push_back(
                    t.get<std::string>());
    }
    WikiStore store;
    store.updatePage(
        std::stoll(id),
        body.value("title", std::string{}),
        body.value("bodyMd", std::string{}),
        req->getHeader("X-User-Id"),
        optField(body, "kbType"),
        optField(body, "startupType"),
        optField(body, "stage"),
        tags,
        [cb, id](const json& d) {
            nextra::search::SearchEventPublisher
                ::publish("upsert", "wiki_pages",
                          id, d);
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

void WikiController::deletePage(
    const drogon::HttpRequestPtr&,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb,
    const std::string& id)
{
    WikiStore store;
    store.deletePage(
        std::stoll(id),
        [cb, id](const json& d) {
            nextra::search::SearchEventPublisher
                ::publishDelete("wiki_pages", id);
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
