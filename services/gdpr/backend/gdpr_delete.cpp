/**
 * @file gdpr_delete.cpp
 * @brief GdprDeleteService::deleteAccount.
 *        Records audit row, then deletes user row.
 *        CASCADE handles all linked application data.
 */

#include "GdprDeleteService.h"
#include <drogon/drogon.h>
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

using drogon::orm::Result;
using drogon::orm::DrogonDbException;

namespace services::gdpr
{

void GdprDeleteService::deleteAccount(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    // Insert completed audit row BEFORE deletion so
    // the record survives even though CASCADE would
    // remove a pending row tied to users(id).
    const auto auditSql =
        "INSERT INTO gdpr_requests"
        " (user_id, type, status, completed_at)"
        " VALUES"
        " ($1::uuid, 'deletion', 'complete', NOW())";

    db()->execSqlAsync(auditSql,
        [userId, ok, err](const Result&) {
            spdlog::info(
                "gdpr deletion audit recorded "
                "userId={}", userId);

            const auto delSql =
                "DELETE FROM users WHERE id=$1::uuid";

            drogon::app()
                .getDbClient()
                ->execSqlAsync(delSql,
                    [ok](const Result&) {
                        ok(json{{"deleted", true}});
                    },
                    [err](
                        const DrogonDbException& e) {
                        spdlog::error(
                            "gdpr deleteAccount: {}",
                            e.base().what());
                        err(drogon::
                            k500InternalServerError,
                            e.base().what());
                    },
                    userId);
        },
        [err](const DrogonDbException& e) {
            spdlog::error(
                "gdpr deletion audit insert: {}",
                e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::gdpr
