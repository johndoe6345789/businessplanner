/// @file EmailAccountService.cpp -- Account listing.
#include "email/backend/EmailAccountService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailAccountService::listAccounts(
    const std::string& userId,
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
        WHERE user_id = $1::uuid
        ORDER BY created_at
    )";

    *db << sql << userId
        >> [onSuccess](const Result& r) {
        auto str = [](const Row& row,
                      const char* c) {
            return row[c].isNull()
                ? std::string()
                : row[c].as<std::string>();
        };
        json accounts = json::array();
        for (const auto& row : r) {
            accounts.push_back({
                {"id", str(row, "id")},
                {"accountName",
                 str(row, "account_name")},
                {"emailAddress",
                 str(row, "email_address")},
                {"imapHost",
                 str(row, "imap_host")},
                {"imapPort",
                 row["imap_port"].as<int>()},
                {"imapEncryption",
                 str(row, "imap_encryption")},
                {"smtpHost",
                 str(row, "smtp_host")},
                {"smtpPort",
                 row["smtp_port"].as<int>()},
                {"smtpEncryption",
                 str(row, "smtp_encryption")},
                {"syncStatus",
                 str(row, "sync_status")},
            });
        }
        onSuccess({{"accounts", accounts}});
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("listAccounts: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
