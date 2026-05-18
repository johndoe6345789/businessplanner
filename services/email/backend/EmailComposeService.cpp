/// @file EmailComposeService.cpp -- Account load + send.
#include "email/backend/EmailComposeService.h"
#include "email/backend/EmailComposeSend.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailComposeService::sendEmail(
    const std::string& userId,
    const json& data,
    SyncCb onSuccess, SyncErrCb onError)
{
    if (!data.is_object()) {
        onError(k400BadRequest,
                "Request body required");
        return;
    }
    if (!data.contains("accountId")
        || !data["accountId"].is_string()
        || data["accountId"]
               .get<std::string>().empty()) {
        onError(k400BadRequest,
                "accountId required");
        return;
    }
    auto accountId =
        data["accountId"].get<std::string>();

    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT email_address, smtp_host, smtp_port,
               smtp_encryption, smtp_user, smtp_pass
        FROM email_accounts
        WHERE id = $1::uuid AND user_id = $2::uuid
    )";

    *db << sql << accountId << userId
        >> [data, onSuccess, onError](
               const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Account not found");
            return;
        }
        composeSmtpSubmit(
            r[0], data, onSuccess, onError);
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("compose load: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Send failed");
    };
}

} // namespace services
