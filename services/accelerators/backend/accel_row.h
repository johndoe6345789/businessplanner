#pragma once
/**
 * @file accel_row.h
 * @brief Internal helper: hydrate accelerator JSON
 *        from a database row.
 *        Included by accel_read.cpp and
 *        accel_write.cpp only.
 */

#include "accel_types.h"
#include <drogon/orm/Row.h>

namespace services::accelerators
{

/**
 * @brief Hydrate an accelerator JSON object from row.
 * @param r  Row from accelerator_programmes table.
 * @return   JSON object with all programme fields.
 */
inline json accelRowToJson(
    const drogon::orm::Row& r)
{
    json out;
    out["id"] = r["id"].as<std::string>();
    out["user_id"] =
        r["user_id"].as<std::string>();
    out["name"] = r["name"].as<std::string>();
    out["programme_type"] =
        r["programme_type"].as<std::string>();
    out["website"] =
        r["website"].as<std::string>();
    out["deadline"] = r["deadline"].isNull()
        ? json(nullptr)
        : json(r["deadline"].as<std::string>());
    out["status"] =
        r["status"].as<std::string>();
    out["notes"] = r["notes"].as<std::string>();
    out["equity_pct"] =
        r["equity_pct"].isNull()
        ? json(nullptr)
        : json(r["equity_pct"]
               .as<double>());
    out["funding_gbp"] =
        r["funding_gbp"].isNull()
        ? json(nullptr)
        : json(r["funding_gbp"]
               .as<double>());
    out["created_at"] =
        r["created_at"].as<std::string>();
    out["updated_at"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::accelerators
