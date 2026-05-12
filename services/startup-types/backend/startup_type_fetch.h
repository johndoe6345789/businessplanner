#pragma once
/**
 * @file startup_type_fetch.h
 * @brief Internal helper: load stages + traps
 *        and merge them into a type JSON object.
 */

#include "startup_type_types.h"
#include <drogon/orm/DbClient.h>

namespace services::startup_types
{

/**
 * @brief Fetch stages then traps for @p slug,
 *        merge them into @p base, then call @p ok.
 * @param c     Drogon DB client.
 * @param slug  Startup-type slug.
 * @param base  Partially-built type JSON object.
 * @param ok    Success callback.
 * @param err   Error callback.
 */
void fetchStagesAndTraps(
    const drogon::orm::DbClientPtr& c,
    const std::string& slug,
    json base,
    Callback ok,
    ErrCallback err);

} // namespace services::startup_types
