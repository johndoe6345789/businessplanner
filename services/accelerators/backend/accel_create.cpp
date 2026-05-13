/**
 * @file accel_create.cpp
 * @brief AcceleratorService::createAccelerator.
 */

#include "AcceleratorService.h"
#include "accel_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::accelerators
{

using drogon::orm::Result;

void AcceleratorService::createAccelerator(
    const std::string& userId,
    const json& data,
    Callback ok,
    ErrCallback err)
{
    auto name  = data.value("name",
                            std::string{});
    auto ptype = data.value("programme_type",
                  std::string{"accelerator"});
    auto web   = data.value("website",
                            std::string{});
    auto dead  = data.value("deadline",
                            std::string{});
    auto stat  = data.value("status",
                  std::string{"researching"});
    auto notes = data.value("notes",
                            std::string{});
    const auto sql =
        "INSERT INTO accelerator_programmes"
        " (user_id, name, programme_type,"
        "  website, deadline, status, notes)"
        " VALUES ($1::uuid,$2,$3,$4,"
        "  NULLIF($5,'')::date,$6,$7)"
        " RETURNING id::text, user_id::text,"
        "  name, programme_type, website,"
        "  deadline::text, status, notes,"
        "  equity_pct::float,"
        "  funding_gbp::float,"
        "  created_at::text, updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            ok(accelRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("createAccelerator: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, name, ptype,
        web, dead, stat, notes);
}

} // namespace services::accelerators
