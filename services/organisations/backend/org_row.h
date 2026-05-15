#pragma once
/**
 * @file org_row.h
 * @brief Row hydration and array conversion helpers
 *        for the organisations domain.
 */

#include "org_types.h"
#include <drogon/orm/Row.h>

namespace services::organisations
{

/**
 * @brief Converts a JSON string array to a
 *        PostgreSQL array literal.
 *        Example: ["a","b"] → {"a","b"}
 * @param arr JSON array of strings.
 * @returns   PostgreSQL TEXT[] literal string.
 */
inline std::string jsonArrToPg(const json& arr)
{
    if (!arr.is_array() || arr.empty())
        return "{}";
    std::string out = "{";
    for (std::size_t i = 0;
         i < arr.size(); ++i)
    {
        if (i > 0) out += ',';
        out += '"';
        out += arr[i].get<std::string>();
        out += '"';
    }
    return out + '}';
}

/**
 * @brief Hydrates an organisation row to JSON.
 *        Expects aliased columns:
 *        et_json (entity_types), tags_json (tags).
 * @param r  Row from the organisations table.
 * @returns  JSON object with all org fields.
 */
inline json orgRowToJson(
    const drogon::orm::Row& r)
{
    return {
        {"id",   r["id"].as<std::string>()},
        {"user_id",
         r["user_id"].as<std::string>()},
        {"name", r["name"].as<std::string>()},
        {"website",
         r["website"].as<std::string>()},
        {"description",
         r["description"].as<std::string>()},
        {"entity_types",
         json::parse(
             r["et_json"].as<std::string>())},
        {"tags",
         json::parse(
             r["tags_json"].as<std::string>())},
        {"notes", r["notes"].as<std::string>()},
        {"created_at",
         r["created_at"].as<std::string>()},
        {"updated_at",
         r["updated_at"].as<std::string>()},
    };
}

} // namespace services::organisations
