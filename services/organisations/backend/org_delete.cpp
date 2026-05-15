/**
 * @file org_delete.cpp
 * @brief OrgStore::deleteOrg implementation.
 */

#include "OrgStore.h"
#include "org_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::organisations
{

using drogon::orm::Result;

void OrgStore::deleteOrg(
    const std::string& id,
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "DELETE FROM organisations"
        " WHERE id=$1::uuid AND user_id=$2::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result&) {
            ok(json::object());
        },
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("deleteOrg: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId);
}

} // namespace services::organisations
