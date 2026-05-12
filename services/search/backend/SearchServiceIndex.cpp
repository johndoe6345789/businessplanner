/// @file SearchServiceIndex.cpp
/// LaunchPad indexing methods: kb content,
/// planner steps, community posts, founders.
#include "search/backend/SearchService.h"

#include <spdlog/spdlog.h>

namespace services
{

static const std::string kKbIndex =
    "launchpad-kb";
static const std::string kPlannerIndex =
    "launchpad-planner";
static const std::string kCommunityIndex =
    "launchpad-community";
static const std::string kFoundersIndex =
    "launchpad-founders";

void SearchService::indexKbContent(
    const std::string& docId, const json& data,
    Callback onOk, ErrCallback onErr)
{
    json doc = {
        {"content_type", data.value(
             "content_type", "guide")},
        {"startup_type", data.value(
             "startup_type", "")},
        {"stage",        data.value("stage", "")},
        {"title",        data.value("title", "")},
        {"body_md",      data.value("body_md", "")},
        {"tags",         data.value(
             "tags", json::array())},
        {"updated_at",   data.value(
             "updated_at", "")}
    };
    spdlog::debug("indexKbContent id={}", docId);
    es_.indexDoc(kKbIndex, docId, doc,
        [onOk](json r) { onOk(std::move(r)); },
        [onErr](int c, std::string m) {
            spdlog::warn(
                "indexKbContent err {}: {}", c, m);
            onErr(drogon::k502BadGateway,
                  std::move(m));
        });
}

void SearchService::indexPlannerStep(
    const std::string& docId, const json& data,
    Callback onOk, ErrCallback onErr)
{
    json doc = {
        {"step_id",      data.value("step_id", "")},
        {"startup_type", data.value(
             "startup_type", "")},
        {"stage",        data.value("stage", "")},
        {"title",        data.value("title", "")},
        {"description",  data.value(
             "description", "")},
        {"tags",         data.value(
             "tags", json::array())}
    };
    spdlog::debug("indexPlannerStep id={}", docId);
    es_.indexDoc(kPlannerIndex, docId, doc,
        [onOk](json r) { onOk(std::move(r)); },
        [onErr](int c, std::string m) {
            spdlog::warn(
                "indexPlannerStep err {}: {}", c, m);
            onErr(drogon::k502BadGateway,
                  std::move(m));
        });
}

void SearchService::indexCommunityPost(
    const std::string& postId, const json& data,
    Callback onOk, ErrCallback onErr)
{
    json doc = {
        {"target_type",  data.value(
             "target_type", "")},
        {"target_id",    data.value(
             "target_id", "")},
        {"author_id",    data.value(
             "author_id", "")},
        {"startup_type", data.value(
             "startup_type", "")},
        {"title",        data.value("title", "")},
        {"body",         data.value("body", "")},
        {"created_at",   data.value(
             "created_at", "")}
    };
    spdlog::debug(
        "indexCommunityPost id={}", postId);
    es_.indexDoc(kCommunityIndex, postId, doc,
        [onOk](json r) { onOk(std::move(r)); },
        [onErr](int c, std::string m) {
            spdlog::warn(
                "indexCommunityPost err {}: {}",
                c, m);
            onErr(drogon::k502BadGateway,
                  std::move(m));
        });
}

void SearchService::indexFounder(
    const std::string& userId, const json& data,
    Callback onOk, ErrCallback onErr)
{
    json doc = {
        {"username",     data.value(
             "username", "")},
        {"display_name", data.value(
             "display_name", "")},
        {"startup_type", data.value(
             "startup_type", "")},
        {"stage",        data.value("stage", "")},
        {"bio",          data.value("bio", "")}
    };
    spdlog::debug("indexFounder id={}", userId);
    es_.indexDoc(kFoundersIndex, userId, doc,
        [onOk](json r) { onOk(std::move(r)); },
        [onErr](int c, std::string m) {
            spdlog::warn(
                "indexFounder err {}: {}", c, m);
            onErr(drogon::k502BadGateway,
                  std::move(m));
        });
}

} // namespace services
