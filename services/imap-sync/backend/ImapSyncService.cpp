/// @file ImapSyncService.cpp -- sync lock + dispatch.
#include "imap-sync/backend/ImapSyncService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

#include <thread>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void ImapSyncService::runSync(
    const ImapConfig& cfg,
    const std::string& accountId, int lastUid,
    SyncCb onSuccess, SyncErrCb onError)
{
    std::thread([this, cfg, accountId, lastUid,
                 onSuccess, onError]() {
        try {
            auto x = fetchFromImap(
                cfg, accountId, lastUid);
            onSuccess(
                {{"status", "complete"},
                 {"newMessages",
                  x.value("newMessages", 0)}});
        } catch (const std::exception& e) {
            spdlog::error(
                "IMAP sync error: {}", e.what());
            drogon::app().getDbClient()
                ->execSqlAsync(
                    "UPDATE email_accounts SET "
                    "sync_status='error' WHERE "
                    "id=$1::uuid",
                    [](const Result&) {},
                    [](const DrogonDbException&) {},
                    accountId);
            onError(k500InternalServerError,
                    "IMAP sync failed");
        }
    }).detach();
}

void ImapSyncService::syncAccount(
    const std::string& accountId,
    const std::string& userId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    // Race-safe lock: a single caller wins the
    // idle -> syncing transition for this account.
    const std::string sql = R"(
        UPDATE email_accounts SET sync_status='syncing'
        WHERE id=$1::uuid AND user_id=$2::uuid
          AND sync_status<>'syncing'
        RETURNING imap_host, imap_port, imap_user,
                  imap_pass, last_sync_uid
    )";

    *db << sql << accountId << userId
        >> [this, accountId, userId, onSuccess,
            onError](const Result& r) {
        if (r.empty()) {
            lockMissed(accountId, userId,
                       onSuccess, onError);
            return;
        }
        auto row = r[0];
        auto env = imapConfigFromEnv();
        ImapConfig cfg{
            row["imap_host"].isNull()
                ? env.host
                : row["imap_host"]
                      .as<std::string>(),
            row["imap_port"].isNull()
                ? env.port
                : row["imap_port"].as<int>(),
            row["imap_user"].isNull()
                ? env.user
                : row["imap_user"]
                      .as<std::string>(),
            row["imap_pass"].isNull()
                ? env.pass
                : row["imap_pass"]
                      .as<std::string>()};
        runSync(cfg, accountId,
                row["last_sync_uid"].as<int>(),
                onSuccess, onError);
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("Sync DB error: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
