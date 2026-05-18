#pragma once
/// @file ImapSyncService.h
/// @brief IMAP mailbox sync service: connects to
/// Dovecot via mailio, fetches new messages, and
/// stores them in the email_messages table.

#include "imap-sync/backend/imap_sync_types.h"

#include <mailio/message.hpp>

#include <list>
#include <map>

namespace services
{

/// @class ImapSyncService
/// @brief Syncs an IMAP mailbox into Postgres.
/// All public methods are owner-scoped by userId
/// and report via the (onSuccess, onError) pair.
class ImapSyncService
{
  public:
    ImapSyncService() = default;

    /// @brief Sync messages for an owned account
    /// (status + new count on success).
    void syncAccount(
        const std::string& accountId,
        const std::string& userId,
        SyncCb onSuccess,
        SyncErrCb onError);

    /// @brief List live IMAP folders for an owned
    /// account (JSON array on success).
    void folders(
        const std::string& accountId,
        const std::string& userId,
        SyncCb onSuccess,
        SyncErrCb onError);

    /// @brief Report current sync state for an
    /// owned account (status JSON on success).
    void syncStatus(
        const std::string& accountId,
        const std::string& userId,
        SyncCb onSuccess,
        SyncErrCb onError);

  private:
    /// Dispatch a held sync off the loop; success
    /// {"status":"complete","newMessages":N};
    /// failure sets sync_status='error' and
    /// reports a generic 500 (detail logged only).
    void runSync(
        const ImapConfig& cfg,
        const std::string& accountId,
        int lastUid,
        SyncCb onSuccess,
        SyncErrCb onError);

    /// Resolve a missed sync lock: account absent
    /// / not owned (404) vs already syncing.
    void lockMissed(
        const std::string& accountId,
        const std::string& userId,
        SyncCb onSuccess,
        SyncErrCb onError);

    /// @brief Blocking IMAP fetch (runs off-loop);
    /// returns JSON with newMessages count.
    [[nodiscard]] auto fetchFromImap(
        const ImapConfig& cfg,
        const std::string& accountId,
        int lastUid) -> json;

    /// @brief Persist fetched messages; returns
    /// the number of new rows inserted.
    int storeMessages(
        const std::map<unsigned long,
                       mailio::message>& fetched,
        const std::string& accountId,
        const std::list<unsigned long>& results);
};

} // namespace services
