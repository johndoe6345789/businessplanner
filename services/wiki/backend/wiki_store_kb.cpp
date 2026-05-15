/**
 * @file wiki_store_kb.cpp
 * @brief listKbPages implementation for WikiStore.
 *        Filters wiki_pages by kb_type,
 *        startup_type, and stage.
 */

#include "WikiStore.h"
#include <spdlog/spdlog.h>

namespace services::wiki
{

static const std::string kKbQuery = R"(
    SELECT id, title, slug, path::text AS path,
           kb_type, startup_type, stage,
           COALESCE(ARRAY_TO_JSON(tags)::text,'[]') AS tags_json,
           updated_at
    FROM wiki_pages
    WHERE kb_type IS NOT NULL
      AND (NULLIF($1, '') IS NULL
           OR startup_type = $1)
      AND (NULLIF($2, '') IS NULL
           OR stage = $2)
      AND (NULLIF($3, '') IS NULL
           OR kb_type = $3)
    ORDER BY path
)";

void WikiStore::listKbPages(
    const std::optional<std::string>& startupType,
    const std::optional<std::string>& stage,
    const std::optional<std::string>& kbType,
    Callback ok, ErrCallback err)
{
    const std::string stArg =
        startupType.value_or(std::string{});
    const std::string stgArg =
        stage.value_or(std::string{});
    const std::string kbArg =
        kbType.value_or(std::string{});
    // Pass strings directly; SQL uses NULLIF($N,'')
    // to treat empty string as NULL in the filter.
    *db() << kKbQuery
          << stArg
          << stgArg
          << kbArg >>
        [ok](const drogon::orm::Result& r) {
            auto arr = json::array();
            for (const auto& row : r) {
                arr.push_back({
                    {"id",
                     row["id"]
                         .as<std::int64_t>()},
                    {"title",
                     row["title"]
                         .as<std::string>()},
                    {"slug",
                     row["slug"]
                         .as<std::string>()},
                    {"path",
                     row["path"]
                         .as<std::string>()},
                    {"kbType",
                     row["kb_type"].isNull()
                         ? json(nullptr)
                         : json(row["kb_type"]
                               .as<std::string>())},
                    {"startupType",
                     row["startup_type"].isNull()
                         ? json(nullptr)
                         : json(row["startup_type"]
                               .as<std::string>())},
                    {"stage",
                     row["stage"].isNull()
                         ? json(nullptr)
                         : json(row["stage"]
                               .as<std::string>())},
                    {"tags",
                     json::parse(
                         row["tags_json"]
                             .as<std::string>())},
                    {"updatedAt",
                     row["updated_at"]
                         .as<std::string>()},
                });
            }
            ok(arr);
        } >>
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("wiki kb list: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to list KB pages");
        };
}

} // namespace services::wiki
