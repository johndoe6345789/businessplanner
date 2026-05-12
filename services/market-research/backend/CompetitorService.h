#pragma once
/**
 * @file CompetitorService.h
 * @brief Service for the competitors table.
 */

#include "mr_types.h"
#include <string>

namespace services::market_research
{

/**
 * @brief CRUD service for competitors rows.
 */
class CompetitorService
{
  public:
    /**
     * @brief List all competitors for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with JSON array on success.
     * @param err     Called with status + msg on error.
     */
    void listCompetitors(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Create a new competitor.
     * @param userId  UUID of the authenticated user.
     * @param data    Request body with competitor fields.
     * @param ok      Called with created row on success.
     * @param err     Called with status + msg on error.
     */
    void createCompetitor(
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Update an existing competitor.
     * @param userId  UUID of the authenticated user.
     * @param id      UUID of the competitor to update.
     * @param data    Fields to update.
     * @param ok      Called with updated row on success.
     * @param err     Called with status + msg on error.
     */
    void updateCompetitor(
        const std::string& userId,
        const std::string& id,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Delete a competitor.
     * @param userId  UUID of the authenticated user.
     * @param id      UUID of the competitor to delete.
     * @param ok      Called with empty JSON on success.
     * @param err     Called with status + msg on error.
     */
    void deleteCompetitor(
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
