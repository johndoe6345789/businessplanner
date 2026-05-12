/**
 * @file tam_get.cpp
 * @brief TamService::getTam implementation.
 */

#include "TamService.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void TamService::getTam(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT user_id::text, total_market_usd,"
        " target_segment_pct, reachable_pct,"
        " notes, updated_at::text"
        " FROM tam_inputs WHERE user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            if (res.empty()) {
                ok(json::object());
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
            spdlog::error("getTam: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::market_research
