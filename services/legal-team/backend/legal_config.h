#pragma once
/**
 * @file legal_config.h
 * @brief Loads legal-team constants from JSON.
 */

#include <fstream>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

namespace services::legal_team
{

using json = nlohmann::json;

/**
 * @brief Load legal-team constants from
 *        services/legal-team/constants.json.
 * @return Parsed config, or empty object on
 *         failure (callers use safe defaults).
 */
inline auto loadLegalConfig() -> json
{
    const std::string paths[] = {
        "services/legal-team/constants.json",
        "legal-team/constants.json",
        "constants.json"
    };
    for (const auto& p : paths) {
        std::ifstream ifs(p);
        if (ifs.is_open()) {
            try {
                return json::parse(ifs);
            } catch (
                const std::exception& e) {
                spdlog::error(
                    "Failed to parse {}: {}",
                    p, e.what());
            }
        }
    }
    spdlog::warn(
        "legal-team constants.json not found;"
        " using defaults");
    return json::object();
}

} // namespace services::legal_team
