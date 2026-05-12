/**
 * @file gdpr_export_queries2.cpp
 * @brief Financials query helper for data export.
 *        Fetches burn, unit economics, pricing,
 *        hypotheses, and kill criteria.
 */

#include "gdpr_export_helpers.h"
#include <drogon/drogon.h>
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

using drogon::orm::Result;
using drogon::orm::DrogonDbException;

namespace services::gdpr::detail
{

void fetchFinancials(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err)
{
    const auto sql =
        "SELECT"
        " (SELECT row_to_json(b) FROM"
        "   (SELECT * FROM burn_inputs"
        "    WHERE user_id=$1::uuid) b) AS burn,"
        " (SELECT row_to_json(u) FROM"
        "   (SELECT * FROM unit_econ_inputs"
        "    WHERE user_id=$1::uuid) u)"
        "  AS unit_econ,"
        " (SELECT row_to_json(p) FROM"
        "   (SELECT * FROM pricing_inputs"
        "    WHERE user_id=$1::uuid) p)"
        "  AS pricing,"
        " (SELECT json_agg(h) FROM"
        "   (SELECT * FROM financial_hypotheses"
        "    WHERE user_id=$1::uuid) h)"
        "  AS hypotheses,"
        " (SELECT row_to_json(k) FROM"
        "   (SELECT * FROM kill_criteria"
        "    WHERE user_id=$1::uuid) k)"
        "  AS kill_criteria";

    static auto db = []() {
        return drogon::app().getDbClient();
    };

    db()->execSqlAsync(sql,
        [acc, next](const Result& r) {
            if (r.empty()) { next(); return; }
            auto& row = r[0];
            auto p = [&](const char* col) {
                return json::parse(
                    row[col].as<std::string>(),
                    nullptr, false);
            };
            acc->data["financials"] = {
                {"burn",        p("burn")},
                {"unitEcon",    p("unit_econ")},
                {"pricing",     p("pricing")},
                {"hypotheses",  p("hypotheses")},
                {"killCriteria",p("kill_criteria")}
            };
            next();
        },
        [err](const DrogonDbException& e) {
            spdlog::error(
                "gdpr fetchFinancials: {}",
                e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        acc->userId);
}

} // namespace services::gdpr::detail
