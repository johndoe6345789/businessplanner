/**
 * @file equity_split.cpp
 * @brief Equity split calculator implementation.
 */

#include "EquityService.h"
#include "equity_split_score.h"
#include <spdlog/spdlog.h>
#include <cmath>

namespace services::legal_team
{

void EquityService::calcSplit(
    const json& founders,
    Callback ok,
    ErrCallback err)
{
    if (!founders.is_array()
        || founders.empty()) {
        spdlog::warn(
            "calcSplit: founders must be a "
            "non-empty array");
        err(drogon::k400BadRequest,
            "founders must be a non-empty array");
        return;
    }

    const auto cfg = loadLegalConfig();
    std::vector<double> scores;
    scores.reserve(founders.size());

    for (const auto& f : founders) {
        scores.push_back(
            founderScore(f, cfg));
    }

    double total = 0.0;
    for (double s : scores) { total += s; }

    if (total <= 0.0) {
        err(drogon::k400BadRequest,
            "total score is zero");
        return;
    }

    json splits = json::array();
    double sumPct = 0.0;
    std::size_t maxIdx = 0;
    double maxScore = -1.0;

    for (std::size_t i = 0;
         i < founders.size(); ++i) {
        double pct = std::round(
            (scores[i] / total * 100.0)
            * 10.0)
            / 10.0;
        sumPct += pct;
        if (scores[i] > maxScore) {
            maxScore = scores[i];
            maxIdx = i;
        }
        splits.push_back({
            {"name",
             founders[i].value("name", "")},
            {"score", scores[i]},
            {"equityPct", pct}
        });
    }

    double diff =
        std::round(
            (100.0 - sumPct) * 10.0)
        / 10.0;
    if (diff != 0.0) {
        splits[maxIdx]["equityPct"] =
            std::round(
                (splits[maxIdx]["equityPct"]
                     .get<double>()
                 + diff)
                * 10.0)
            / 10.0;
    }

    ok({{"splits", splits},
        {"totalScore", total}});
}

} // namespace services::legal_team
