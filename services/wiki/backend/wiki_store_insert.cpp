/**
 * @file wiki_store_insert.cpp
 * @brief Low-level insert helpers used by
 *        wiki_store_write.cpp. Split out to
 *        keep files under the 100 LOC budget.
 */

#include "wiki_store_insert.h"
#include "wiki_store_insert_helpers.h"
#include <spdlog/spdlog.h>

namespace services::wiki
{

// Root page (no parent).
static const std::string kInsRoot = R"(
    INSERT INTO wiki_pages
      (tenant_id, parent_id, slug, title,
       body_md, path, depth,
       created_by, updated_by,
       kb_type, startup_type, stage, tags)
    VALUES
      ($1::uuid, NULL, $2, $3, $4,
       text2ltree($5), 0,
       NULLIF($6,'')::uuid,
       NULLIF($6,'')::uuid,
       NULLIF($7,''),
       NULLIF($8,''),
       NULLIF($9,''),
       $10::text[])
    RETURNING id, path::text AS path
)";

// Child page (has parent).
static const std::string kInsChild = R"(
    INSERT INTO wiki_pages
      (tenant_id, parent_id, slug, title,
       body_md, path, depth,
       created_by, updated_by,
       kb_type, startup_type, stage, tags)
    VALUES
      ($1::uuid, $2, $3, $4, $5,
       text2ltree($6), $7,
       NULLIF($8,'')::uuid,
       NULLIF($8,'')::uuid,
       NULLIF($9,''),
       NULLIF($10,''),
       NULLIF($11,''),
       $12::text[])
    RETURNING id, path::text AS path
)";

void insertPageRow(
    const drogon::orm::DbClientPtr& c,
    const InsertArgs& a,
    Callback ok, ErrCallback err)
{
    auto onOk =
        [ok](const drogon::orm::Result& r) {
            ok({
              {"id",
               r[0]["id"].as<std::int64_t>()},
              {"path",
               r[0]["path"].as<std::string>()},
            });
        };
    auto onErr =
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("wiki insert: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to create page");
        };
    auto tags = tagsToArray(a.tags);
    if (a.parent) {
        *c << kInsChild << a.tenantId
           << *a.parent << a.slug << a.title
           << a.bodyMd << a.path << a.depth
           << a.authorId
           << optOrEmpty(a.kbType)
           << optOrEmpty(a.startupType)
           << optOrEmpty(a.stage)
           << tags >> onOk >> onErr;
    } else {
        *c << kInsRoot << a.tenantId << a.slug
           << a.title << a.bodyMd << a.path
           << a.authorId
           << optOrEmpty(a.kbType)
           << optOrEmpty(a.startupType)
           << optOrEmpty(a.stage)
           << tags >> onOk >> onErr;
    }
}

} // namespace services::wiki
