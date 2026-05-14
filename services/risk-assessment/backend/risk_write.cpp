/**
 * @file risk_write.cpp
 * @brief RiskAssessmentService update + delete
 *        implementations.
 */

#include "RiskAssessmentService.h"
#include "risk_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::risk_assessment
{

using drogon::orm::Result;

void RiskAssessmentService::updateRisk(
    const std::string& id,
    const std::string& userId,
    const json& data,
    Callback ok,
    ErrCallback err)
{
    auto cat   = data.value("category",
                            std::string{});
    auto title = data.value("title",
                            std::string{});
    auto desc  = data.value("description",
                            std::string{});
    auto prob  = data.value("probability", 0);
    auto imp   = data.value("impact", 0);
    auto mit   = data.value("mitigation_strategy",
                            std::string{});
    auto owner = data.value("owner",
                            std::string{});
    auto stat  = data.value("status",
                            std::string{});
    const auto sql =
        "UPDATE risks SET"
        "  category=$3, title=$4,"
        "  description=$5,"
        "  probability=$6::int, impact=$7::int,"
        "  mitigation_strategy=$8,"
        "  owner=$9, status=$10,"
        "  updated_at=NOW()"
        " WHERE id=$1::uuid AND user_id=$2::uuid"
        " RETURNING id::text, user_id::text,"
        "  category, title, description,"
        "  probability, impact, risk_score,"
        "  mitigation_strategy, owner, status,"
        "  created_at::text, updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k404NotFound,
                    "risk not found");
                return;
            }
            ok(riskRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("updateRisk: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId, cat, title, desc,
        prob, imp, mit, owner, stat);
}

void RiskAssessmentService::deleteRisk(
    const std::string& id,
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "DELETE FROM risks"
        " WHERE id=$1::uuid AND user_id=$2::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result&) {
            ok(json::object());
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("deleteRisk: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId);
}

} // namespace services::risk_assessment
