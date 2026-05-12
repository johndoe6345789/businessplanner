#pragma once
/**
 * @file TamService.h
 * @brief Service for TAM (Total Addressable Market)
 *        inputs stored in the tam_inputs table.
 */

#include "mr_types.h"
#include <string>

namespace services::market_research
{

/**
 * @brief CRUD service for tam_inputs.
 *        One row per user (upsert semantics).
 */
class TamService
{
  public:
    /**
     * @brief Fetch the TAM record for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with TAM JSON on success.
     * @param err     Called with status + msg on error.
     */
    void getTam(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Upsert the TAM record for a user.
     * @param userId    UUID of the authenticated user.
     * @param jsonBody  Request body with TAM fields.
     * @param ok        Called with saved row on success.
     * @param err       Called with status + msg on error.
     */
    void saveTam(
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
