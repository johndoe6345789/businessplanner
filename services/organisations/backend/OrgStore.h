#pragma once
/**
 * @file OrgStore.h
 * @brief CRUD store for the organisations table.
 */

#include "org_types.h"
#include <optional>
#include <string>

namespace services::organisations
{

/**
 * @brief Async CRUD store for organisation records.
 */
class OrgStore
{
  public:
    /**
     * @brief List organisations for a user.
     * @param userId UUID of the authenticated user.
     * @param search Optional name search fragment.
     * @param ok     Called with JSON array.
     * @param err    Called with status + message.
     */
    void listOrgs(
        const std::string& userId,
        const std::optional<std::string>& search,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Create a new organisation record.
     * @param userId UUID of the authenticated user.
     * @param data   Request body with org fields.
     * @param ok     Called with created row.
     * @param err    Called with status + message.
     */
    void createOrg(
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Update an existing organisation.
     * @param id     UUID of the record to update.
     * @param userId UUID of the authenticated user.
     * @param data   Fields to update.
     * @param ok     Called with updated row.
     * @param err    Called with status + message.
     */
    void updateOrg(
        const std::string& id,
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Delete an organisation record.
     * @param id     UUID of the record to delete.
     * @param userId UUID of the authenticated user.
     * @param ok     Called with empty JSON object.
     * @param err    Called with status + message.
     */
    void deleteOrg(
        const std::string& id,
        const std::string& userId,
        Callback ok,
        ErrCallback err);

  private:
    /** @brief Convenience DB accessor. */
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::organisations
