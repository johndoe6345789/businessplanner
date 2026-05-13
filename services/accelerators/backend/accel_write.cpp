/**
 * @file accel_write.cpp
 * @brief AcceleratorService update + delete methods.
 */

#include "AcceleratorService.h"
#include "accel_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::accelerators
{

using drogon::orm::Result;

void AcceleratorService::updateAccelerator(
    const std::string& id,
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
        "UPDATE accelerator_programmes SET"
        "  name=$3, programme_type=$4,"
        "  website=$5,"
        "  deadline=NULLIF($6,'')::date,"
        "  status=$7, notes=$8,"
        "  updated_at=NOW()"
        " WHERE id=$1::uuid AND user_id=$2::uuid"
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
                err(drogon::k404NotFound,
                    "programme not found");
                return;
            }
            ok(accelRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("updateAccelerator: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId, name, ptype,
        web, dead, stat, notes);
}

void AcceleratorService::deleteAccelerator(
    const std::string& id,
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "DELETE FROM accelerator_programmes"
        " WHERE id=$1::uuid AND user_id=$2::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result&) {
            ok(json::object());
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("deleteAccelerator: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId);
}

} // namespace services::accelerators
