/**
 * @file risk_create.cpp
 * @brief RiskAssessmentService::createRisk
 *        implementation.
 */

#include "RiskAssessmentService.h"
#include "risk_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>
#include <set>

namespace services::risk_assessment
{

using drogon::orm::Result;

static const std::set<std::string> VALID_CATEGORIES{
    "market", "financial", "operational",
    "legal", "technical"
};

void RiskAssessmentService::createRisk(
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
                            std::string{"open"});
    auto orgId = data.value("organisation_id",
                            std::string{});
    if (!VALID_CATEGORIES.count(cat)) {
        err(drogon::k400BadRequest,
            "invalid category");
        return;
    }
    if (prob < 1 || prob > 5) {
        err(drogon::k400BadRequest,
            "probability must be 1-5");
        return;
    }
    if (imp < 1 || imp > 5) {
        err(drogon::k400BadRequest,
            "impact must be 1-5");
        return;
    }
    const auto sql =
        "INSERT INTO risks"
        " (user_id, category, title, description,"
        "  probability, impact, mitigation_strategy,"
        "  owner, status, organisation_id)"
        " VALUES"
        " ($1::uuid,$2,$3,$4,$5::int,$6::int,"
        "  $7,$8,$9,NULLIF($10,'')::uuid)"
        " RETURNING id::text, user_id::text,"
        "  category, title, description,"
        "  probability, impact, risk_score,"
        "  mitigation_strategy, owner, status,"
        "  created_at::text, updated_at::text,"
        "  organisation_id::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            ok(riskRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("createRisk: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, cat, title, desc,
        prob, imp, mit, owner, stat, orgId);
}

} // namespace services::risk_assessment
