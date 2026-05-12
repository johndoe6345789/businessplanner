#pragma once
/**
 * @file wiki_store_insert_helpers.h
 * @brief Internal string conversion utilities
 *        used by wiki_store_insert.cpp.
 */

#include <optional>
#include <string>
#include <vector>

namespace services::wiki
{

/**
 * @brief Returns the value of @p v or an empty
 *        string when absent.
 */
inline std::string optOrEmpty(
    const std::optional<std::string>& v)
{
    return v.value_or(std::string{});
}

/**
 * @brief Converts a string vector to a PostgreSQL
 *        array literal such as @c {"a","b"}.
 * @param tags  Input vector.
 * @return Literal suitable for a @c ::text[] cast.
 */
inline std::string tagsToArray(
    const std::vector<std::string>& tags)
{
    if (tags.empty()) return "{}";
    std::string out = "{";
    for (std::size_t i = 0;
         i < tags.size(); ++i) {
        if (i > 0) out += ",";
        out += "\"" + tags[i] + "\"";
    }
    out += "}";
    return out;
}

} // namespace services::wiki
