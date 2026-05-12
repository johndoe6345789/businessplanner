/**
 * @file persona_service_write.cpp
 * @brief PersonaService update + delete methods.
 */

#include "PersonaService.h"
#include "persona_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void PersonaService::updatePersona(
    const std::string& userId,
    const std::string& id,
    const json& data,
    Callback ok,
    ErrCallback err)
{
    auto name  = data.value("name",
                            std::string{});
    auto role  = data.value("role",
                            std::string{});
    auto desc  = data.value("description",
                            std::string{});
    const auto sql =
        "UPDATE personas SET"
        "  name=$3, role=$4, description=$5,"
        "  updated_at=NOW()"
        " WHERE id=$2::uuid AND user_id=$1::uuid"
        " RETURNING id::text, user_id::text, name,"
        "  role, description, pain_points, goals,"
        "  channels, created_at::text,"
        "  updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k404NotFound,
                    "persona not found");
                return;
            }
            ok(rowToPersona(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("updatePersona: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, id, name, role, desc);
}

void PersonaService::deletePersona(
    const std::string& userId,
    const std::string& id,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "DELETE FROM personas"
        " WHERE id=$2::uuid AND user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result&) {
            ok(json::object());
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("deletePersona: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, id);
}

} // namespace services::market_research
