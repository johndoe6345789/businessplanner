/**
 * @file gdpr_export_mr.cpp
 * @brief Market-research query helper for data export.
 *        Fetches TAM, competitors, personas, discovery,
 *        and BMC canvas in a single SQL statement.
 */

#include "gdpr_export_helpers.h"
#include <drogon/drogon.h>
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

using drogon::orm::Result;
using drogon::orm::DrogonDbException;

namespace services::gdpr::detail
{

void fetchMarketResearch(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err)
{
    const auto sql =
        "SELECT"
        " (SELECT row_to_json(t) FROM"
        "   (SELECT * FROM tam_inputs"
        "    WHERE user_id=$1::uuid) t) AS tam,"
        " (SELECT json_agg(c) FROM"
        "   (SELECT * FROM competitors"
        "    WHERE user_id=$1::uuid) c)"
        "  AS competitors,"
        " (SELECT json_agg(p) FROM"
        "   (SELECT * FROM personas"
        "    WHERE user_id=$1::uuid) p)"
        "  AS personas,"
        " (SELECT json_agg(d) FROM"
        "   (SELECT * FROM discovery_entries"
        "    WHERE user_id=$1::uuid) d)"
        "  AS discovery,"
        " (SELECT row_to_json(b) FROM"
        "   (SELECT * FROM bmc_canvas"
        "    WHERE user_id=$1::uuid) b) AS bmc";

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
            acc->data["market_research"] = {
                {"tam",         p("tam")},
                {"competitors", p("competitors")},
                {"personas",    p("personas")},
                {"discovery",   p("discovery")},
                {"bmc",         p("bmc")}
            };
            next();
        },
        [err](const DrogonDbException& e) {
            spdlog::error(
                "gdpr fetchMarketResearch: {}",
                e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        acc->userId);
}

} // namespace services::gdpr::detail
