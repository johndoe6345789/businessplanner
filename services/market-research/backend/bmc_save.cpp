/**
 * @file bmc_save.cpp
 * @brief BmcService::saveBmc implementation.
 */

#include "BmcService.h"
#include "bmc_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void BmcService::saveBmc(
    const std::string& userId,
    const json& body,
    Callback ok,
    ErrCallback err)
{
    auto prob  = body.value("problem",
                            std::string{});
    auto sol   = body.value("solution",
                            std::string{});
    auto uvp   = body.value("uvp",
                            std::string{});
    auto chan  = body.value("channels",
                            std::string{});
    auto cseg  = body.value("customerSegments",
                            std::string{});
    auto cost  = body.value("costStructure",
                            std::string{});
    auto rev   = body.value("revenueStreams",
                            std::string{});
    auto kmet  = body.value("keyMetrics",
                            std::string{});
    auto uadv  = body.value("unfairAdvantage",
                            std::string{});
    const auto sql =
        "INSERT INTO bmc_canvas"
        " (user_id, problem, solution, uvp,"
        "  channels, customer_segments,"
        "  cost_structure, revenue_streams,"
        "  key_metrics, unfair_advantage,"
        "  updated_at)"
        " VALUES ($1::uuid,$2,$3,$4,$5,$6,"
        "         $7,$8,$9,$10,NOW())"
        " ON CONFLICT (user_id) DO UPDATE SET"
        "  problem=EXCLUDED.problem,"
        "  solution=EXCLUDED.solution,"
        "  uvp=EXCLUDED.uvp,"
        "  channels=EXCLUDED.channels,"
        "  customer_segments="
        "    EXCLUDED.customer_segments,"
        "  cost_structure=EXCLUDED.cost_structure,"
        "  revenue_streams=EXCLUDED.revenue_streams,"
        "  key_metrics=EXCLUDED.key_metrics,"
        "  unfair_advantage="
        "    EXCLUDED.unfair_advantage,"
        "  updated_at=NOW()"
        " RETURNING user_id::text, problem,"
        "  solution, uvp, channels,"
        "  customer_segments, cost_structure,"
        "  revenue_streams, key_metrics,"
        "  unfair_advantage, updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "upsert failed");
                return;
            }
            ok(rowToBmc(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("saveBmc: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, prob, sol, uvp, chan, cseg,
        cost, rev, kmet, uadv);
}

} // namespace services::market_research
