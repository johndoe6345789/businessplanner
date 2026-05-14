/**
 * @file risk_list.cpp
 * @brief RiskAssessmentService::listRisks
 *        implementation.
 */

#include "RiskAssessmentService.h"
#include "risk_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::risk_assessment
{

using drogon::orm::Result;

void RiskAssessmentService::listRisks(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT id::text, user_id::text,"
        " category, title, description,"
        " probability, impact, risk_score,"
        " mitigation_strategy, owner, status,"
        " created_at::text, updated_at::text"
        " FROM risks"
        " WHERE user_id=$1::uuid"
        " ORDER BY risk_score DESC,"
        "          created_at DESC";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res)
                arr.push_back(riskRowToJson(r));
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("listRisks: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::risk_assessment
