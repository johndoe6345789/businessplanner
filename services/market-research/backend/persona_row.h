#pragma once
/**
 * @file persona_row.h
 * @brief Internal helper: hydrate persona JSON.
 *        Included by persona_service_*.cpp only.
 */

#include "mr_types.h"
#include <drogon/orm/Row.h>

namespace services::market_research
{

/** @brief Hydrate a persona JSON from a DB row. */
inline json rowToPersona(
    const drogon::orm::Row& r)
{
    json out;
    out["id"]          =
        r["id"].as<std::string>();
    out["userId"]      =
        r["user_id"].as<std::string>();
    out["name"]        =
        r["name"].as<std::string>();
    out["role"]        =
        r["role"].as<std::string>();
    out["description"] =
        r["description"].as<std::string>();
    out["painPoints"]  = json::array();
    out["goals"]       = json::array();
    out["channels"]    = json::array();
    out["createdAt"]   =
        r["created_at"].as<std::string>();
    out["updatedAt"]   =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::market_research
