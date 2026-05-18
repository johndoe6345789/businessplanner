/// @file imap_sync_folders.cpp -- folders endpoint.
#include "imap-sync/backend/ImapSyncService.h"
#include "imap-sync/backend/imap_sync_folders.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

#include <string>
#include <thread>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void ImapSyncService::folders(
    const std::string& accountId,
    const std::string& userId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT imap_host, imap_port, imap_user,
               imap_pass, imap_encryption
        FROM email_accounts
        WHERE id=$1::uuid AND user_id=$2::uuid
    )";

    *db << sql << accountId << userId
        >> [onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Account not found");
            return;
        }
        auto row = r[0];
        auto env = imapConfigFromEnv();
        auto col = [&](const char* c,
                       const std::string& d) {
            return row[c].isNull()
                       ? d
                       : row[c].as<std::string>();
        };
        std::string enc =
            col("imap_encryption", "tls");
        std::string host = col("imap_host",
                               env.host);
        std::string usr = col("imap_user",
                              env.user);
        std::string pwd = col("imap_pass",
                              env.pass);
        int port =
            row["imap_port"].isNull()
                ? (enc == "tls" ? 993 : env.port)
                : row["imap_port"].as<int>();
        std::thread([=]() {
            try {
                onSuccess(imapListFolders(
                    host, port, usr, pwd, enc));
            } catch (const std::exception& e) {
                spdlog::error(
                    "IMAP folders error: {}",
                    e.what());
                onError(k500InternalServerError,
                        "IMAP error");
            }
        }).detach();
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("Folders DB error: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
