#pragma once
/**
 * @file GdprDeleteService.h
 * @brief Service for GDPR right-to-erasure account
 *        deletion.  Logs the request, then deletes
 *        the users row (CASCADE removes all data).
 */

#include "gdpr_types.h"
#include <string>

namespace services::gdpr
{

/**
 * @brief Permanently deletes a user account and all
 *        associated data via CASCADE FK rules.
 */
class GdprDeleteService
{
  public:
    /**
     * @brief Delete the account for the given user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with {"deleted": true}.
     * @param err     Called with status + msg on error.
     */
    void deleteAccount(
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
