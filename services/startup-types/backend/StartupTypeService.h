#pragma once
/**
 * @file StartupTypeService.h
 * @brief Data-access layer for startup-type
 *        reference data. All queries are read-only.
 */

#include "startup_type_types.h"

namespace services::startup_types
{

/**
 * @brief SQL-facing service for startup types,
 *        their ordered stages, and common traps.
 */
class StartupTypeService
{
  public:
    /**
     * @brief Fetch all startup types ordered by
     *        sort_order.
     * @param ok   Called with JSON array of types.
     * @param err  Called on DB error.
     */
    void listTypes(
        Callback ok, ErrCallback err);

    /**
     * @brief Fetch a single startup type by slug,
     *        including its stages and traps.
     * @param slug  URL slug of the type.
     * @param ok    Called with type JSON object.
     * @param err   Called on DB error or not-found.
     */
    void getType(
        const std::string& slug,
        Callback ok, ErrCallback err);

  private:
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::startup_types
