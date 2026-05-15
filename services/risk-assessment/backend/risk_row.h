#pragma once
/**
 * @file risk_row.h
 * @brief Internal helper: hydrate risk JSON
 *        from a database row.
 *        Included by risk_list.cpp,
 *        risk_create.cpp, and risk_write.cpp only.
 */

#include "risk_types.h"
#include <drogon/orm/Row.h>

namespace services::risk_assessment
{

/**
 * @brief Hydrate a risk JSON object from a DB row.
 * @param r  Database row from the risks table.
 * @return   JSON object with all risk fields.
 */
inline json riskRowToJson(
    const drogon::orm::Row& r)
{
    json out;
    out["id"]     = r["id"].as<std::string>();
    out["user_id"] =
        r["user_id"].as<std::string>();
    out["category"] =
        r["category"].as<std::string>();
    out["title"] = r["title"].as<std::string>();
    out["description"] =
        r["description"].as<std::string>();
    out["probability"] = r["probability"].as<int>();
    out["impact"]      = r["impact"].as<int>();
    out["risk_score"]  = r["risk_score"].as<int>();
    out["mitigation_strategy"] =
        r["mitigation_strategy"].as<std::string>();
    out["owner"]  = r["owner"].as<std::string>();
    out["status"] = r["status"].as<std::string>();
    out["created_at"] =
        r["created_at"].as<std::string>();
    out["updated_at"] =
        r["updated_at"].as<std::string>();
    if (r["organisation_id"].isNull())
        out["organisation_id"] = nullptr;
    else
        out["organisation_id"] =
            r["organisation_id"].as<std::string>();
    return out;
}

} // namespace services::risk_assessment
