#pragma once
/**
 * @file EmailInboxService.h
 * @brief Query email messages from the database.
 */

#include "imap-sync/backend/imap_sync_types.h"

namespace services
{

/**
 * @class EmailInboxService
 * @brief Lists and retrieves synced emails.
 */
class EmailInboxService
{
  public:
    EmailInboxService() = default;

    /**
     * @brief List messages for the owner.
     * @param userId     Owning user UUID.
     * @param accountId  Optional account filter.
     * @param folder     IMAP folder name.
     * @param page       Page number (1-based).
     * @param pageSize   Messages per page.
     * @param onSuccess  Returns paged envelope.
     * @param onError    Called on failure.
     */
    void listMessages(
        const std::string& userId,
        const std::string& accountId,
        const std::string& folder,
        int page, int pageSize,
        SyncCb onSuccess,
        SyncErrCb onError);

    /**
     * @brief Get a single owned message by ID.
     * @param userId     Owning user UUID.
     * @param messageId  Message UUID.
     * @param onSuccess  Returns message JSON.
     * @param onError    Called on failure.
     */
    void getMessage(
        const std::string& userId,
        const std::string& messageId,
        SyncCb onSuccess,
        SyncErrCb onError);

    /**
     * @brief Set a message read flag (owned).
     * @param userId     Owning user UUID.
     * @param messageId  Message UUID.
     * @param isRead     New read state.
     * @param onSuccess  Returns updated message.
     * @param onError    Called on failure / 404.
     */
    void markRead(
        const std::string& userId,
        const std::string& messageId,
        bool isRead,
        SyncCb onSuccess,
        SyncErrCb onError);

    /**
     * @brief Set a message starred flag (owned).
     * @param userId     Owning user UUID.
     * @param messageId  Message UUID.
     * @param isStarred  New starred state.
     * @param onSuccess  Returns updated message.
     * @param onError    Called on failure / 404.
     */
    void setStar(
        const std::string& userId,
        const std::string& messageId,
        bool isStarred,
        SyncCb onSuccess,
        SyncErrCb onError);
};

} // namespace services
