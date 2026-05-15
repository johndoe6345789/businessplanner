/**
 * @file org_create.cpp
 * @brief OrgStore::createOrg implementation.
 */

#include "OrgStore.h"
#include "org_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::organisations
{

using drogon::orm::Result;

static const std::string kCreateSql =
    "INSERT INTO organisations"
    " (user_id,name,website,description,"
    "  entity_types,tags,notes)"
    " VALUES ($1::uuid,$2,$3,$4,"
    "  $5::text[],$6::text[],$7)"
    " RETURNING id::text, user_id::text,"
    "  name, website, description,"
    "  COALESCE(ARRAY_TO_JSON("
    "    entity_types)::text,'[]') AS et_json,"
    "  COALESCE(ARRAY_TO_JSON("
    "    tags)::text,'[]') AS tags_json,"
    "  notes, created_at::text,"
    "  updated_at::text";

void OrgStore::createOrg(
    const std::string& userId,
    const json& data,
    Callback ok,
    ErrCallback err)
{
    auto name  = data.value("name",
                            std::string{});
    auto web   = data.value("website",
                            std::string{});
    auto desc  = data.value("description",
                            std::string{});
    auto types = jsonArrToPg(
        data.value("entity_types", json::array()));
    auto tags  = jsonArrToPg(
        data.value("tags", json::array()));
    auto notes = data.value("notes",
                            std::string{});
    db()->execSqlAsync(
        kCreateSql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            ok(orgRowToJson(res[0]));
        },
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("createOrg: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, name, web,
        desc, types, tags, notes);
}

} // namespace services::organisations
