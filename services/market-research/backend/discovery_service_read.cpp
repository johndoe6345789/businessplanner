/**
 * @file discovery_service_read.cpp
 * @brief DiscoveryService::listEntries method.
 */

#include "DiscoveryService.h"
#include "discovery_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void DiscoveryService::listEntries(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT id::text, user_id::text,"
        " contact_name, contact_role,"
        " interview_date::text, key_findings,"
        " verbatim_quote, validated_assumptions,"
        " invalidated_assumptions,"
        " created_at::text"
        " FROM discovery_entries"
        " WHERE user_id=$1::uuid"
        " ORDER BY interview_date DESC";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res)
                arr.push_back(rowToEntry(r));
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("listEntries: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::market_research
