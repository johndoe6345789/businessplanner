/**
 * @file gdpr_export.cpp
 * @brief GdprExportService::exportUserData.
 *        Inserts audit row, chains query helpers,
 *        and marks the request complete on success.
 */

#include "GdprExportService.h"
#include "gdpr_export_helpers.h"
#include <drogon/drogon.h>
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

using drogon::orm::Result;
using drogon::orm::DrogonDbException;
using detail::AccPtr;

namespace services::gdpr
{

/** @brief Mark the audit row complete and call ok. */
static void markComplete(
    AccPtr acc,
    std::int64_t rid,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "UPDATE gdpr_requests"
        " SET status='complete', completed_at=NOW()"
        " WHERE id=$1";
    drogon::app().getDbClient()->execSqlAsync(
        sql,
        [acc, ok](const Result&) { ok(acc->data); },
        [err](const DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        rid);
}

void GdprExportService::exportUserData(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto auditSql =
        "INSERT INTO gdpr_requests"
        " (user_id, type, status)"
        " VALUES ($1::uuid, 'export', 'pending')"
        " RETURNING id";

    db()->execSqlAsync(auditSql,
        [userId, ok, err](const Result& r) {
            auto rid =
                r[0]["id"].as<std::int64_t>();
            spdlog::info("gdpr export "
                "rid={} user={}", rid, userId);

            auto acc = std::make_shared<
                detail::ExportAcc>();
            acc->userId = userId;
            acc->data["exported_at"] =
                drogon::utils::getFormattedDate();

            auto finish = [acc, rid, ok, err]() {
                markComplete(acc, rid, ok, err);
            };

            using detail::fetchUser;
            using detail::fetchMarketResearch;
            using detail::fetchFinancials;
            using detail::fetchNotifications;

            fetchUser(acc,
                [acc, err, finish]() {
                    fetchMarketResearch(acc,
                        [acc, err, finish]() {
                            fetchFinancials(acc,
                                [acc, err, finish]()
                                {
                                    fetchNotifications(
                                        acc,
                                        finish,
                                        err);
                                },
                                err);
                        }, err);
                }, err);
        },
        [err](const DrogonDbException& e) {
            spdlog::error("gdpr audit: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::gdpr
