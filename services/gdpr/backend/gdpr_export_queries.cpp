/**
 * @file gdpr_export_queries.cpp
 * @brief User profile query helper for data export.
 */

#include "gdpr_export_helpers.h"
#include <drogon/drogon.h>
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

using drogon::orm::Result;
using drogon::orm::DrogonDbException;

namespace services::gdpr::detail
{

static auto db()
{
    return drogon::app().getDbClient();
}

void fetchUser(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err)
{
    const auto sql =
        "SELECT id::text, email, created_at::text"
        " FROM users WHERE id=$1::uuid";
    db()->execSqlAsync(sql,
        [acc, next](const Result& r) {
            if (!r.empty()) {
                auto& row = r[0];
                acc->data["user"] = {
                    {"id",
                     row["id"].as<std::string>()},
                    {"email",
                     row["email"].as<std::string>()},
                    {"createdAt",
                     row["created_at"]
                         .as<std::string>()}
                };
            }
            next();
        },
        [err](const DrogonDbException& e) {
            spdlog::error("gdpr fetchUser: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        acc->userId);
}

} // namespace services::gdpr::detail
