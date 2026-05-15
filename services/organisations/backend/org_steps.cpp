/**
 * @file org_steps.cpp
 * @brief OrgStore::listSteps implementation.
 */

#include "OrgStore.h"
#include "org_types.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::organisations
{

using drogon::orm::Result;

static const std::string kStepsSql =
    "SELECT id::text, organisation_id::text,"
    " step_number, title, description,"
    " created_at::text"
    " FROM startup_steps"
    " WHERE organisation_id=$1::uuid"
    " ORDER BY step_number";

void OrgStore::listSteps(
    const std::string& orgId,
    Callback ok,
    ErrCallback err)
{
    db()->execSqlAsync(
        kStepsSql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res) {
                arr.push_back({
                    {"id",
                     r["id"].as<std::string>()},
                    {"organisation_id",
                     r["organisation_id"]
                         .as<std::string>()},
                    {"step_number",
                     r["step_number"].as<int>()},
                    {"title",
                     r["title"].as<std::string>()},
                    {"description",
                     r["description"]
                         .as<std::string>()},
                    {"created_at",
                     r["created_at"]
                         .as<std::string>()},
                });
            }
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("listSteps: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        orgId);
}

} // namespace services::organisations
