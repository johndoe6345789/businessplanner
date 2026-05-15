/**
 * @file org_write.cpp
 * @brief OrgStore::updateOrg implementation.
 */

#include "OrgStore.h"
#include "org_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::organisations
{

using drogon::orm::Result;

static const std::string kUpdateSql =
    "UPDATE organisations SET"
    "  name=$3,website=$4,description=$5,"
    "  entity_types=$6::text[],"
    "  tags=$7::text[],notes=$8,"
    "  initial_investment_gbp=$9::int,"
    "  weeks_to_bootstrap=$10::int,"
    "  monthly_revenue_gbp=$11::int,"
    "  parent_org_id=NULLIF($12,'')::uuid,"
    "  updated_at=NOW()"
    " WHERE id=$1::uuid AND user_id=$2::uuid"
    " RETURNING id::text, user_id::text,"
    "  name, website, description,"
    "  COALESCE(ARRAY_TO_JSON("
    "    entity_types)::text,'[]') AS et_json,"
    "  COALESCE(ARRAY_TO_JSON("
    "    tags)::text,'[]') AS tags_json,"
    "  notes, created_at::text,"
    "  updated_at::text,"
    "  initial_investment_gbp,"
    "  weeks_to_bootstrap,"
    "  monthly_revenue_gbp,"
    "  parent_org_id::text";

void OrgStore::updateOrg(
    const std::string& id,
    const std::string& userId,
    const json& data,
    Callback ok,
    ErrCallback err)
{
    auto name  = data.value("name", std::string{});
    auto web   = data.value("website",
                            std::string{});
    auto desc  = data.value("description",
                            std::string{});
    auto types = jsonArrToPg(
        data.value("entity_types", json::array()));
    auto tags  = jsonArrToPg(
        data.value("tags", json::array()));
    auto notes = data.value("notes", std::string{});
    auto inv   = data.value(
        "initial_investment_gbp", 0);
    auto wks   = data.value(
        "weeks_to_bootstrap", 0);
    auto rev   = data.value(
        "monthly_revenue_gbp", 0);
    auto par   = data.value("parent_org_id",
                            std::string{});
    db()->execSqlAsync(
        kUpdateSql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k404NotFound,
                    "organisation not found");
                return;
            }
            ok(orgRowToJson(res[0]));
        },
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("updateOrg: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId, name, web,
        desc, types, tags, notes,
        inv, wks, rev, par);
}

} // namespace services::organisations
