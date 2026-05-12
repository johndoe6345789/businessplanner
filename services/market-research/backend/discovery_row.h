#pragma once
/**
 * @file discovery_row.h
 * @brief Internal helper: hydrate discovery JSON.
 *        Included by discovery_service_*.cpp only.
 */

#include "mr_types.h"
#include <drogon/orm/Row.h>

namespace services::market_research
{

/** @brief Hydrate a discovery entry JSON from row. */
inline json rowToEntry(
    const drogon::orm::Row& r)
{
    json out;
    out["id"]      = r["id"].as<std::string>();
    out["userId"]  =
        r["user_id"].as<std::string>();
    out["contactName"] =
        r["contact_name"].as<std::string>();
    out["contactRole"] =
        r["contact_role"].as<std::string>();
    out["interviewDate"] =
        r["interview_date"].as<std::string>();
    out["keyFindings"] =
        r["key_findings"].as<std::string>();
    out["verbatimQuote"] =
        r["verbatim_quote"].as<std::string>();
    out["validatedAssumptions"]   =
        json::array();
    out["invalidatedAssumptions"] =
        json::array();
    out["createdAt"] =
        r["created_at"].as<std::string>();
    return out;
}

} // namespace services::market_research
