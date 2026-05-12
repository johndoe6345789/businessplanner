#pragma once
/**
 * @file DiscoveryService.h
 * @brief Service for the discovery_entries table.
 */

#include "mr_types.h"
#include <string>

namespace services::market_research
{

/**
 * @brief List/create/delete service for
 *        customer-discovery interview log entries.
 */
class DiscoveryService
{
  public:
    /**
     * @brief List all discovery entries for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with JSON array on success.
     * @param err     Called with status + msg on error.
     */
    void listEntries(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Create a new discovery entry.
     * @param userId  UUID of the authenticated user.
     * @param data    Request body with entry fields.
     * @param ok      Called with created row on success.
     * @param err     Called with status + msg on error.
     */
    void createEntry(
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Delete a discovery entry.
     * @param userId  UUID of the authenticated user.
     * @param id      UUID of the entry to delete.
     * @param ok      Called with empty JSON on success.
     * @param err     Called with status + msg on error.
     */
    void deleteEntry(
        const std::string& userId,
        const std::string& id,
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
