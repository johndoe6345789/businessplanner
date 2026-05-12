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
           tags::text AS tags_raw, updated_at
    FROM wiki_pages
    WHERE kb_type IS NOT NULL
      AND ($1::text IS NULL
           OR startup_type = $1)
      AND ($2::text IS NULL
           OR stage = $2)
      AND ($3::text IS NULL
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
    // Drogon sends an empty string for NULL params
    // via NULLIF in the SQL.
    *db() << kKbQuery
          << (stArg.empty()
              ? std::string{} : stArg)
          << (stgArg.empty()
              ? std::string{} : stgArg)
          << (kbArg.empty()
              ? std::string{} : kbArg) >>
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
                    {"updatedAt",
                     row["updated_at"]
                         .as<std::string>()},
                });
            }
            ok({{"pages", arr}});
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
