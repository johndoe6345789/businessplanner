/// @file EmailInboxServiceFlags.cpp
/// @brief Owner-scoped read/star flag updates.
#include "email/backend/EmailInboxService.h"
#include "email/backend/EmailMessageJson.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

/**
 * @brief Run an owner-scoped flag UPDATE.
 * @param col        Boolean column to set.
 * @param value      New flag value.
 * @param messageId  Message UUID.
 * @param userId     Owning user UUID.
 * @param onSuccess  Returns updated message.
 * @param onError    Called on failure / 404.
 */
static void updateFlag(
    const std::string& col, bool value,
    const std::string& messageId,
    const std::string& userId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql =
        "UPDATE email_messages m SET " + col +
        " = $3 FROM email_accounts a"
        " WHERE m.id = $1::uuid"
        "   AND m.account_id = a.id"
        "   AND a.user_id = $2::uuid"
        " RETURNING m.*";

    *db << sql << messageId << userId << value
        >> [onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Message not found");
            return;
        }
        onSuccess(messageRowToJson(r[0]));
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("updateFlag: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

void EmailInboxService::markRead(
    const std::string& userId,
    const std::string& messageId,
    bool isRead,
    SyncCb onSuccess, SyncErrCb onError)
{
    updateFlag("is_read", isRead, messageId,
               userId, onSuccess, onError);
}

void EmailInboxService::setStar(
    const std::string& userId,
    const std::string& messageId,
    bool isStarred,
    SyncCb onSuccess, SyncErrCb onError)
{
    updateFlag("is_starred", isStarred,
               messageId, userId, onSuccess,
               onError);
}

} // namespace services
