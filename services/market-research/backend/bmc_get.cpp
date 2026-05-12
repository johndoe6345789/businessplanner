/**
 * @file bmc_get.cpp
 * @brief BmcService::getBmc implementation.
 */

#include "BmcService.h"
#include "bmc_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void BmcService::getBmc(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT user_id::text, problem, solution,"
        " uvp, channels, customer_segments,"
        " cost_structure, revenue_streams,"
        " key_metrics, unfair_advantage,"
        " updated_at::text"
        " FROM bmc_canvas"
        " WHERE user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            if (res.empty()) {
                ok(json::object());
                return;
            }
            ok(rowToBmc(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("getBmc: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::market_research
