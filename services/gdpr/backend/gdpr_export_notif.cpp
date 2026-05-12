/**
 * @file gdpr_export_notif.cpp
 * @brief Notifications query helper for data export.
 *        Returns the 200 most recent notification rows
 *        for the user ordered by created_at DESC.
 */

#include "gdpr_export_helpers.h"
#include <drogon/drogon.h>
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

using drogon::orm::Result;
using drogon::orm::DrogonDbException;

namespace services::gdpr::detail
{

void fetchNotifications(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err)
{
    const auto sql =
        "SELECT id, channel, template, status,"
        " created_at::text"
        " FROM notifications"
        " WHERE user_id=$1::uuid"
        " ORDER BY created_at DESC LIMIT 200";

    static auto db = []() {
        return drogon::app().getDbClient();
    };

    db()->execSqlAsync(sql,
        [acc, next](const Result& r) {
            json arr = json::array();
            for (const auto& row : r) {
                arr.push_back({
                    {"id",
                     row["id"]
                         .as<std::int64_t>()},
                    {"channel",
                     row["channel"]
                         .as<std::string>()},
                    {"template",
                     row["template"]
                         .as<std::string>()},
                    {"status",
                     row["status"]
                         .as<std::string>()},
                    {"createdAt",
                     row["created_at"]
                         .as<std::string>()}
                });
            }
            acc->data["notifications"] =
                std::move(arr);
            next();
        },
        [err](const DrogonDbException& e) {
            spdlog::error(
                "gdpr fetchNotifications: {}",
                e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        acc->userId);
}

} // namespace services::gdpr::detail
