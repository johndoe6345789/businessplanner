#pragma once
/**
 * @file AcceleratorService.h
 * @brief Service for the accelerator_programmes table.
 */

#include "accel_types.h"
#include <string>

namespace services::accelerators
{

/**
 * @brief CRUD service for accelerator programme rows.
 */
class AcceleratorService
{
  public:
    /**
     * @brief List programmes for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with JSON array on success.
     * @param err     Called with status + msg on error.
     */
    void listAccelerators(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Create a new programme record.
     * @param userId  UUID of the authenticated user.
     * @param data    Request body with programme fields.
     * @param ok      Called with created row on success.
     * @param err     Called with status + msg on error.
     */
    void createAccelerator(
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Update an existing programme record.
     * @param id      UUID of the record to update.
     * @param userId  UUID of the authenticated user.
     * @param data    Fields to update.
     * @param ok      Called with updated row on success.
     * @param err     Called with status + msg on error.
     */
    void updateAccelerator(
        const std::string& id,
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Delete a programme record.
     * @param id      UUID of the record to delete.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with empty JSON on success.
     * @param err     Called with status + msg on error.
     */
    void deleteAccelerator(
        const std::string& id,
        const std::string& userId,
        Callback ok,
        ErrCallback err);

  private:
    /** @brief Convenience accessor for the DB client. */
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::accelerators
