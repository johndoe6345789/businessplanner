#pragma once
/**
 * @file GdprExportService.h
 * @brief Service for GDPR right-of-access data export.
 *        Aggregates all user data across domains and
 *        returns it as a single JSON payload.
 */

#include "gdpr_types.h"
#include <string>

namespace services::gdpr
{

/**
 * @brief Queries all domain tables for a user and
 *        returns an aggregated JSON export.
 *        Inserts a gdpr_requests audit row on start
 *        and marks it complete on success.
 */
class GdprExportService
{
  public:
    /**
     * @brief Export all data for the given user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with the full export JSON.
     * @param err     Called with status + msg on error.
     */
    void exportUserData(
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

} // namespace services::gdpr
