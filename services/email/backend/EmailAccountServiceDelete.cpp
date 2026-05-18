/// @file EmailAccountServiceDelete.cpp -- Account delete.
#include "email/backend/EmailAccountService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailAccountService::deleteAccount(
    const std::string& userId,
    const std::string& accountId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        DELETE FROM email_accounts
        WHERE id = $1::uuid
          AND user_id = $2::uuid
    )";

    *db << sql << accountId << userId
        >> [onSuccess, onError](
               const Result& r) {
        if (r.affectedRows() == 0) {
            onError(k404NotFound,
                    "Account not found");
            return;
        }
        onSuccess({{"deleted", true}});
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("deleteAccount: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
