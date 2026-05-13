/**
 * @file accel_read.cpp
 * @brief AcceleratorService::listAccelerators.
 */

#include "AcceleratorService.h"
#include "accel_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::accelerators
{

using drogon::orm::Result;

void AcceleratorService::listAccelerators(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT id::text, user_id::text, name,"
        " programme_type, website,"
        " deadline::text, status, notes,"
        " equity_pct::float,"
        " funding_gbp::float,"
        " created_at::text, updated_at::text"
        " FROM accelerator_programmes"
        " WHERE user_id=$1::uuid"
        " ORDER BY deadline ASC NULLS LAST";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res)
                arr.push_back(accelRowToJson(r));
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("listAccelerators: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::accelerators
