#pragma once
/**
 * @file PersonaService.h
 * @brief Service for the personas table.
 */

#include "mr_types.h"
#include <string>

namespace services::market_research
{

/**
 * @brief CRUD service for customer persona rows.
 */
class PersonaService
{
  public:
    /**
     * @brief List all personas for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with JSON array on success.
     * @param err     Called with status + msg on error.
     */
    void listPersonas(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Create a new persona.
     * @param userId  UUID of the authenticated user.
     * @param data    Request body with persona fields.
     * @param ok      Called with created row on success.
     * @param err     Called with status + msg on error.
     */
    void createPersona(
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Update an existing persona.
     * @param userId  UUID of the authenticated user.
     * @param id      UUID of the persona to update.
     * @param data    Fields to update.
     * @param ok      Called with updated row on success.
     * @param err     Called with status + msg on error.
     */
    void updatePersona(
        const std::string& userId,
        const std::string& id,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Delete a persona.
     * @param userId  UUID of the authenticated user.
     * @param id      UUID of the persona to delete.
     * @param ok      Called with empty JSON on success.
     * @param err     Called with status + msg on error.
     */
    void deletePersona(
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
