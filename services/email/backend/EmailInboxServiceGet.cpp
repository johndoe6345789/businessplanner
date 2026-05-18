/// @file EmailInboxServiceGet.cpp -- Single message fetch.
#include "email/backend/EmailInboxService.h"
#include "email/backend/EmailMessageJson.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailInboxService::getMessage(
    const std::string& userId,
    const std::string& messageId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT m.* FROM email_messages m
        JOIN email_accounts a
          ON m.account_id = a.id
        WHERE m.id = $1::uuid
          AND a.user_id = $2::uuid
    )";

    *db << sql << messageId << userId
        >> [onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Message not found");
            return;
        }
        onSuccess(messageRowToJson(r[0]));
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("getMessage: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
