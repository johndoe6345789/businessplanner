/**
 * @file org_read.cpp
 * @brief OrgStore::listOrgs implementation.
 */

#include "OrgStore.h"
#include "org_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::organisations
{

using drogon::orm::Result;

static const std::string kListSql =
    "SELECT id::text, user_id::text,"
    " name, website, description,"
    " COALESCE(ARRAY_TO_JSON("
    "   entity_types)::text,'[]') AS et_json,"
    " COALESCE(ARRAY_TO_JSON("
    "   tags)::text,'[]') AS tags_json,"
    " notes, created_at::text, updated_at::text,"
    " initial_investment_gbp,"
    " weeks_to_bootstrap,"
    " monthly_revenue_gbp,"
    " parent_org_id::text"
    " FROM organisations"
    " WHERE user_id=$1::uuid"
    " AND (NULLIF($2,'') IS NULL"
    "      OR name ILIKE '%' || $2 || '%')"
    " ORDER BY name";

void OrgStore::listOrgs(
    const std::string& userId,
    const std::optional<std::string>& search,
    Callback ok,
    ErrCallback err)
{
    const auto q =
        search.value_or(std::string{});
    db()->execSqlAsync(
        kListSql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res)
                arr.push_back(orgRowToJson(r));
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("listOrgs: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, q);
}

} // namespace services::organisations
