/**
 * @file WikiControllerPages.cpp
 * @brief createPage handler for /api/wiki/pages.
 *        getPage lives in WikiControllerPageRead.cpp.
 *        Update/delete in WikiControllerPagesWrite.cpp.
 */

#include "WikiController.h"
#include "wiki/backend/WikiStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "search/events/SearchEventPublisher.h"

namespace controllers
{

using services::wiki::WikiStore;
using services::wiki::json;

static std::string tenantOf(
    const drogon::HttpRequestPtr& req)
{
    auto t = req->getHeader("X-Tenant-Id");
    return t.empty()
        ? "00000000-0000-0000-0000-000000000000"
        : t;
}

static std::optional<std::string> optField(
    const json& body, const std::string& key)
{
    if (body.contains(key)
        && body[key].is_string()
        && !body[key].get<std::string>().empty())
        return body[key].get<std::string>();
    return std::nullopt;
}

void WikiController::createPage(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()
        || !body.contains("slug")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Invalid JSON body"));
        return;
    }
    std::optional<std::int64_t> parent;
    if (body.contains("parentId")
        && !body["parentId"].is_null()) {
        parent =
            body["parentId"].get<std::int64_t>();
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
    store.createPage(
        tenantOf(req), parent,
        body.value("slug", std::string{}),
        body.value("title", std::string{}),
        body.value("bodyMd", std::string{}),
        req->getHeader("X-User-Id"),
        optField(body, "kbType"),
        optField(body, "startupType"),
        optField(body, "stage"),
        tags,
        [cb](const json& d) {
            const auto idStr = d.contains("id")
                ? std::to_string(
                    d["id"].get<std::int64_t>())
                : std::string{};
            if (!idStr.empty())
                nextra::search::SearchEventPublisher
                    ::publish("upsert",
                              "wiki_pages",
                              idStr, d);
            cb(::utils::jsonCreated(d));
        },
        [cb](drogon::HttpStatusCode c,
             const std::string& m) {
            cb(::utils::jsonError(c, m));
        });
}

} // namespace controllers
