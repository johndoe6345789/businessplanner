/// @file imap_sync_status.cpp -- sync status + lock.
#include "imap-sync/backend/ImapSyncService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void ImapSyncService::lockMissed(
    const std::string& accountId,
    const std::string& userId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    *db << "SELECT 1 FROM email_accounts WHERE "
           "id=$1::uuid AND user_id=$2::uuid"
        << accountId << userId
        >> [onSuccess, onError](const Result& e) {
        if (e.empty())
            onError(k404NotFound,
                    "Account not found");
        else
            onSuccess(
                {{"status", "already_syncing"}});
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("Sync DB error: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

void ImapSyncService::syncStatus(
    const std::string& accountId,
    const std::string& userId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT sync_status, last_sync_at,
               last_sync_uid
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
        json out;
        out["status"] =
            row["sync_status"].isNull()
                ? "idle"
                : row["sync_status"]
                      .as<std::string>();
        out["lastSyncAt"] =
            row["last_sync_at"].isNull()
                ? json(nullptr)
                : json(row["last_sync_at"]
                           .as<std::string>());
        out["lastSyncUid"] =
            row["last_sync_uid"].isNull()
                ? 0
                : row["last_sync_uid"].as<int>();
        onSuccess(out);
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("Status DB error: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
