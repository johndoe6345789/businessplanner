/**
 * @file tam_save.cpp
 * @brief TamService::saveTam implementation.
 */

#include "TamService.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void TamService::saveTam(
    const std::string& userId,
    const json& body,
    Callback ok,
    ErrCallback err)
{
    auto mkt = body.value(
        "totalMarketUsd", std::int64_t{0});
    auto seg = body.value(
        "targetSegmentPct", 0.0);
    auto rch = body.value("reachablePct", 0.0);
    auto notes = body.value(
        "notes", std::string{});
    const auto sql =
        "INSERT INTO tam_inputs"
        " (user_id, total_market_usd,"
        "  target_segment_pct, reachable_pct,"
        "  notes, updated_at)"
        " VALUES ($1::uuid,$2,$3,$4,$5,NOW())"
        " ON CONFLICT (user_id) DO UPDATE SET"
        "  total_market_usd="
        "    EXCLUDED.total_market_usd,"
        "  target_segment_pct="
        "    EXCLUDED.target_segment_pct,"
        "  reachable_pct=EXCLUDED.reachable_pct,"
        "  notes=EXCLUDED.notes,"
        "  updated_at=NOW()"
        " RETURNING user_id::text,"
        "  total_market_usd, target_segment_pct,"
        "  reachable_pct, notes, updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "upsert failed");
                return;
            }
            const auto& r = res[0];
            json out;
            out["userId"] =
                r["user_id"].as<std::string>();
            out["totalMarketUsd"] =
                r["total_market_usd"]
                    .as<std::int64_t>();
            out["targetSegmentPct"] =
                r["target_segment_pct"]
                    .as<double>();
            out["reachablePct"] =
                r["reachable_pct"].as<double>();
            out["notes"] =
                r["notes"].as<std::string>();
            out["updatedAt"] =
                r["updated_at"].as<std::string>();
            ok(std::move(out));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("saveTam: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, mkt, seg, rch, notes);
}

} // namespace services::market_research
