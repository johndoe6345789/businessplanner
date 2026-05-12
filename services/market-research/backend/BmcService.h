#pragma once
/**
 * @file BmcService.h
 * @brief Service for the bmc_canvas table.
 */

#include "mr_types.h"
#include <string>

namespace services::market_research
{

/**
 * @brief Get/upsert service for Business Model
 *        Canvas (one row per user).
 */
class BmcService
{
  public:
    /**
     * @brief Fetch the BMC record for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with BMC JSON on success.
     * @param err     Called with status + msg on error.
     */
    void getBmc(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Upsert the BMC record for a user.
     * @param userId    UUID of the authenticated user.
     * @param jsonBody  Request body with BMC fields.
     * @param ok        Called with saved row on success.
     * @param err       Called with status + msg on error.
     */
    void saveBmc(
        const std::string& userId,
        const json& jsonBody,
        Callback ok,
        ErrCallback err);

  private:
    /** @brief Convenience accessor for the DB client. */
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::market_research
