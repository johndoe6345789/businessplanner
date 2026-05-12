#pragma once
/**
 * @file startup_type_types.h
 * @brief Shared type aliases and callback
 *        signatures for the startup-types domain.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <functional>
#include <string>

namespace services::startup_types
{

using json = nlohmann::json;

/** @brief Success callback carrying a JSON body. */
using Callback =
    std::function<void(json)>;

/** @brief Error callback with status + message. */
using ErrCallback =
    std::function<void(
        drogon::HttpStatusCode, std::string)>;

} // namespace services::startup_types
