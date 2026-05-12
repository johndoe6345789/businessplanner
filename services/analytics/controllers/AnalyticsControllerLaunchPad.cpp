/**
 * @file AnalyticsControllerLaunchPad.cpp
 * @brief GET /api/analytics/launchpad handler.
 *
 * Returns LaunchPad-specific KPI metrics:
 *   weeklyActiveFounders, streakRetentionPct,
 *   totalFounders, hypothesesTotal/Validated.
 */

#include "AnalyticsController.h"
#include "analytics_config.h"
#include "launchpad_helpers.h"

#include <drogon/drogon.h>
#include <drogon/orm/Exception.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon;
using namespace drogon::orm;

namespace controllers
{

void AnalyticsController::launchpadMetrics(
    const HttpRequestPtr& req, Cb&& cb)
{
    if (!requireAdmin(req, cb)) return;

    auto db = app().getDbClient();
    int64_t weeklyActive  = 0;
    double  retentionPct  = 0.0;
    int64_t totalFounders = 0;
    int64_t hypoTotal     = 0;
    int64_t hypoValidated = 0;

    try {
        auto r1 = db->execSqlSync(
            "SELECT COUNT(DISTINCT user_id) AS cnt"
            " FROM streaks WHERE last_active_date"
            " >= NOW() - INTERVAL '7 days'");
        if (!r1.empty())
            weeklyActive =
                r1[0]["cnt"].as<int64_t>();

        auto r2 = db->execSqlSync(
            "SELECT ROUND(100.0 *"
            " COUNT(CASE WHEN s.current_streak > 0"
            "   THEN 1 END)"
            " / NULLIF(COUNT(u.id),0),1) AS pct"
            " FROM users u"
            " LEFT JOIN streaks s"
            "   ON s.user_id = u.id");
        if (!r2.empty() &&
            !r2[0]["pct"].isNull())
            retentionPct =
                r2[0]["pct"].as<double>();

        auto r3 = db->execSqlSync(
            "SELECT COUNT(*) AS cnt FROM users");
        if (!r3.empty())
            totalFounders =
                r3[0]["cnt"].as<int64_t>();

        auto r4 = db->execSqlSync(
            "SELECT COUNT(*) AS total,"
            " COUNT(CASE WHEN status='validated'"
            "   THEN 1 END) AS validated"
            " FROM financial_hypotheses");
        if (!r4.empty()) {
            hypoTotal =
                r4[0]["total"].as<int64_t>();
            hypoValidated =
                r4[0]["validated"].as<int64_t>();
        }
    } catch (const DrogonDbException& e) {
        spdlog::error(
            "launchpad metrics: {}",
            e.base().what());
        cb(::utils::jsonError(
            k500InternalServerError,
            "Internal server error"));
        return;
    }

    cb(::utils::jsonOk({
        {"weeklyActiveFounders", weeklyActive},
        {"streakRetentionPct",   retentionPct},
        {"totalFounders",        totalFounders},
        {"hypothesesTotal",      hypoTotal},
        {"hypothesesValidated",  hypoValidated},
        {"generatedAt",          isoNow()},
    }));
}

} // namespace controllers
