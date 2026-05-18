/// @file EmailAccountServiceGet.cpp -- Single account.
#include "email/backend/EmailAccountService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailAccountService::getAccount(
    const std::string& userId,
    const std::string& accountId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT id, account_name, email_address,
               imap_host, imap_port,
               imap_encryption,
               smtp_host, smtp_port,
               smtp_encryption,
               last_sync_at, sync_status
        FROM email_accounts
        WHERE id = $1::uuid
          AND user_id = $2::uuid
    )";

    *db << sql << accountId << userId
        >> [onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Account not found");
            return;
        }
        auto row = r[0];
        auto str = [&row](const char* c) {
            return row[c].isNull()
                ? std::string()
                : row[c].as<std::string>();
        };
        onSuccess({
            {"id", str("id")},
            {"accountName",
             str("account_name")},
            {"emailAddress",
             str("email_address")},
            {"imapHost", str("imap_host")},
            {"imapPort",
             row["imap_port"].as<int>()},
            {"imapEncryption",
             str("imap_encryption")},
            {"smtpHost", str("smtp_host")},
            {"smtpPort",
             row["smtp_port"].as<int>()},
            {"smtpEncryption",
             str("smtp_encryption")},
            {"syncStatus",
             str("sync_status")},
        });
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("getAccount: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
