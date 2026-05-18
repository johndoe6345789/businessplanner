#pragma once
/**
 * @file EmailComposeService.h
 * @brief Owner-scoped per-account SMTP send.
 *
 * Loads the sender's email account (scoped to the
 * owning user) and submits the composed message via
 * that account's own SMTP server, mirroring the Flask
 * compose route while reusing mailio like EmailService.
 */

#include "imap-sync/backend/imap_sync_types.h"

namespace services
{

/**
 * @class EmailComposeService
 * @brief Sends mail through a user's own SMTP account.
 */
class EmailComposeService
{
  public:
    EmailComposeService() = default;

    /**
     * @brief Load account (owner-scoped) and send.
     *
     * Resolves the account by id, asserts the caller
     * owns it, then performs the blocking SMTP submit
     * and reports the Flask-shaped result.
     *
     * @param userId    Authenticated owner user ID.
     * @param data      Compose body JSON.
     * @param onSuccess {sent,to,subject} on accept.
     * @param onError   400/404/500 generic message.
     */
    void sendEmail(
        const std::string& userId,
        const json& data,
        SyncCb onSuccess,
        SyncErrCb onError);
};

} // namespace services
