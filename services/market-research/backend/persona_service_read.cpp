/**
 * @file persona_service_read.cpp
 * @brief PersonaService list + create methods.
 */

#include "PersonaService.h"
#include "persona_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::market_research
{

using drogon::orm::Result;

void PersonaService::listPersonas(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT id::text, user_id::text, name,"
        " role, description, pain_points, goals,"
        " channels, created_at::text,"
        " updated_at::text"
        " FROM personas"
        " WHERE user_id=$1::uuid"
        " ORDER BY created_at ASC";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res)
                arr.push_back(rowToPersona(r));
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("listPersonas: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

void PersonaService::createPersona(
    const std::string& userId,
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
        "INSERT INTO personas"
        " (user_id, name, role, description)"
        " VALUES ($1::uuid,$2,$3,$4)"
        " RETURNING id::text, user_id::text, name,"
        "  role, description, pain_points, goals,"
        "  channels, created_at::text,"
        "  updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            ok(rowToPersona(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("createPersona: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, name, role, desc);
}

} // namespace services::market_research
