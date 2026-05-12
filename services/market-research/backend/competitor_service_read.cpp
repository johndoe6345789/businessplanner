/**
 * @file competitor_service_read.cpp
 * @brief CompetitorService list + create methods.
 */

#include "CompetitorService.h"
#include "competitor_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void CompetitorService::listCompetitors(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT id::text, user_id::text, name,"
        " website, stage, strengths, weaknesses,"
        " features::text, notes,"
        " created_at::text, updated_at::text"
        " FROM competitors"
        " WHERE user_id=$1::uuid"
        " ORDER BY created_at ASC";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res)
                arr.push_back(rowToCompetitor(r));
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("listCompetitors: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

void CompetitorService::createCompetitor(
    const std::string& userId,
    const json& data,
    Callback ok,
    ErrCallback err)
{
    auto name  = data.value("name",
                            std::string{});
    auto web   = data.value("website",
                            std::string{});
    auto stage = data.value("stage",
                            std::string{});
    auto notes = data.value("notes",
                            std::string{});
    auto feat  = data.contains("features")
        ? data["features"].dump() : "{}";
    const auto sql =
        "INSERT INTO competitors"
        " (user_id, name, website, stage,"
        "  features, notes)"
        " VALUES ($1::uuid,$2,$3,$4,$5::jsonb,$6)"
        " RETURNING id::text, user_id::text, name,"
        "  website, stage, strengths, weaknesses,"
        "  features::text, notes,"
        "  created_at::text, updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            ok(rowToCompetitor(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("createCompetitor: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, name, web, stage, feat, notes);
}

} // namespace services::market_research
