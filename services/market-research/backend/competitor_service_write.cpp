/**
 * @file competitor_service_write.cpp
 * @brief CompetitorService update + delete methods.
 */

#include "CompetitorService.h"
#include "competitor_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void CompetitorService::updateCompetitor(
    const std::string& userId,
    const std::string& id,
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
        "UPDATE competitors SET"
        "  name=$3, website=$4, stage=$5,"
        "  features=$6::jsonb, notes=$7,"
        "  updated_at=NOW()"
        " WHERE id=$2::uuid AND user_id=$1::uuid"
        " RETURNING id::text, user_id::text, name,"
        "  website, stage, strengths, weaknesses,"
        "  features::text, notes,"
        "  created_at::text, updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k404NotFound,
                    "competitor not found");
                return;
            }
            ok(rowToCompetitor(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("updateCompetitor: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, id, name, web, stage, feat, notes);
}

void CompetitorService::deleteCompetitor(
    const std::string& userId,
    const std::string& id,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "DELETE FROM competitors"
        " WHERE id=$2::uuid AND user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result&) {
            ok(json::object());
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("deleteCompetitor: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, id);
}

} // namespace services::market_research
