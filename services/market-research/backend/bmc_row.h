#pragma once
/**
 * @file bmc_row.h
 * @brief Internal helper: hydrate BMC canvas JSON.
 *        Included by bmc_get.cpp + bmc_save.cpp only.
 */

#include "mr_types.h"
#include <drogon/orm/Row.h>

namespace services::market_research
{

/** @brief Hydrate a BMC canvas JSON from a DB row. */
inline json rowToBmc(const drogon::orm::Row& r)
{
    json out;
    out["userId"] =
        r["user_id"].as<std::string>();
    out["problem"] =
        r["problem"].as<std::string>();
    out["solution"] =
        r["solution"].as<std::string>();
    out["uvp"]      =
        r["uvp"].as<std::string>();
    out["channels"] =
        r["channels"].as<std::string>();
    out["customerSegments"] =
        r["customer_segments"].as<std::string>();
    out["costStructure"] =
        r["cost_structure"].as<std::string>();
    out["revenueStreams"] =
        r["revenue_streams"].as<std::string>();
    out["keyMetrics"] =
        r["key_metrics"].as<std::string>();
    out["unfairAdvantage"] =
        r["unfair_advantage"].as<std::string>();
    out["updatedAt"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::market_research
