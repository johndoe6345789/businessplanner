#pragma once
/**
 * @file competitor_row.h
 * @brief Internal helper: hydrate competitor JSON.
 *        Included by competitor_service_*.cpp only.
 */

#include "mr_types.h"
#include <drogon/orm/Row.h>

namespace services::market_research
{

/** @brief Hydrate a competitor JSON from a DB row. */
inline json rowToCompetitor(
    const drogon::orm::Row& r)
{
    json out;
    out["id"]      = r["id"].as<std::string>();
    out["userId"]  =
        r["user_id"].as<std::string>();
    out["name"]    = r["name"].as<std::string>();
    out["website"] =
        r["website"].as<std::string>();
    out["stage"]   = r["stage"].as<std::string>();
    out["strengths"]  = json::array();
    out["weaknesses"] = json::array();
    out["features"]   = json::parse(
        r["features"].as<std::string>(),
        nullptr, false);
    out["notes"]     =
        r["notes"].as<std::string>();
    out["createdAt"] =
        r["created_at"].as<std::string>();
    out["updatedAt"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::market_research
