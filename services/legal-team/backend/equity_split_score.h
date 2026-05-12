#pragma once
/**
 * @file equity_split_score.h
 * @brief Per-founder scoring helpers for the
 *        equity split calculator.
 */

#include "legal_config.h"
#include <algorithm>
#include <cmath>
#include <string>

namespace services::legal_team
{

/**
 * @brief Look up role weight from config.
 * @param role  Founder role string.
 * @param cfg   Parsed constants JSON.
 * @return Weight value as double.
 */
inline auto roleScore(
    const std::string& role,
    const json& cfg) -> double
{
    const auto& rw =
        cfg["equity"]["roleWeights"];
    if (rw.contains(role)) {
        return rw[role].get<double>();
    }
    return rw["other"].get<double>();
}

/**
 * @brief Look up experience weight from config.
 * @param exp  Experience level string.
 * @param cfg  Parsed constants JSON.
 * @return Weight value as double.
 */
inline auto experienceScore(
    const std::string& exp,
    const json& cfg) -> double
{
    const auto& ew =
        cfg["equity"]["experienceWeights"];
    if (ew.contains(exp)) {
        return ew[exp].get<double>();
    }
    return ew["low"].get<double>();
}

/**
 * @brief Compute total weighted score for one
 *        founder.
 * @param f    Founder JSON object.
 * @param cfg  Parsed constants JSON.
 * @return Aggregate score as double.
 */
inline auto founderScore(
    const json& f,
    const json& cfg) -> double
{
    const auto& eq = cfg["equity"];
    double maxTime =
        eq["maxTimeWeight"].get<double>();
    double timeRate =
        eq["timeWeightPerMonth"].get<double>();
    double maxCap =
        eq["maxCapitalWeight"].get<double>();
    double capRate =
        eq["capitalWeightPer1000"].get<double>();
    double ideaW =
        eq["ideaWeight"].get<double>();

    double months =
        f.value("timeCommitmentMonths", 0.0);
    double capital =
        f.value("capitalContribution", 0.0);
    bool idea =
        f.value("ideaOriginator", false);
    std::string exp =
        f.value("priorExperience", "low");
    std::string role =
        f.value("role", "other");

    double timeW =
        std::min(months * timeRate, maxTime);
    double capW =
        std::min(
            (capital / 1000.0) * capRate,
            maxCap);

    return roleScore(role, cfg)
        + timeW + capW
        + (idea ? ideaW : 0.0)
        + experienceScore(exp, cfg);
}

} // namespace services::legal_team
