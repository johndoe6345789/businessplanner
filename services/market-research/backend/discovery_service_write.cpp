/**
 * @file discovery_service_write.cpp
 * @brief DiscoveryService create + delete methods.
 */

#include "DiscoveryService.h"
#include "discovery_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void DiscoveryService::createEntry(
    const std::string& userId,
    const json& data,
    Callback ok,
    ErrCallback err)
{
    auto cname = data.value("contactName",
                            std::string{});
    auto crole = data.value("contactRole",
                            std::string{});
    auto idate = data.value("interviewDate",
                            std::string{});
    auto kfind = data.value("keyFindings",
                            std::string{});
    auto vquote = data.value("verbatimQuote",
                             std::string{});
    const auto sql =
        "INSERT INTO discovery_entries"
        " (user_id, contact_name, contact_role,"
        "  interview_date, key_findings,"
        "  verbatim_quote)"
        " VALUES ($1::uuid,$2,$3,"
        "  COALESCE(NULLIF($4,'')::date,"
        "           CURRENT_DATE),$5,$6)"
        " RETURNING id::text, user_id::text,"
        "  contact_name, contact_role,"
        "  interview_date::text, key_findings,"
        "  verbatim_quote, validated_assumptions,"
        "  invalidated_assumptions,"
        "  created_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            ok(rowToEntry(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("createEntry: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, cname, crole, idate, kfind, vquote);
}

void DiscoveryService::deleteEntry(
    const std::string& userId,
    const std::string& id,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "DELETE FROM discovery_entries"
        " WHERE id=$2::uuid AND user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result&) {
            ok(json::object());
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("deleteEntry: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, id);
}

} // namespace services::market_research
