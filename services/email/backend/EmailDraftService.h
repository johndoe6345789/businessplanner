#pragma once
/**
 * @file EmailDraftService.h
 * @brief Owner-scoped email draft list + create.
 *
 * Mirrors the Flask compose drafts routes: drafts are
 * rows in email_messages with is_draft = true, joined
 * to the caller's own accounts so a user only ever
 * sees and writes drafts on accounts they own.
 */

#include "imap-sync/backend/imap_sync_types.h"

namespace services
{

/**
 * @class EmailDraftService
 * @brief Lists and persists email drafts.
 */
class EmailDraftService
{
  public:
    EmailDraftService() = default;

    /**
     * @brief List the caller's drafts.
     *
     * email_messages WHERE is_draft = true joined to
     * the user's owned accounts, newest first.
     *
     * @param userId    Authenticated owner user ID.
     * @param onSuccess Returns {drafts:[Message,...]}.
     * @param onError   500 on failure.
     */
    void listDrafts(
        const std::string& userId,
        SyncCb onSuccess,
        SyncErrCb onError);

    /**
     * @brief Create a draft for an owned account.
     *
     * INSERT email_messages is_draft = true,
     * folder = 'Drafts'; maps body -> body_text,
     * bodyHtml -> body_html, to -> to_addrs,
     * cc -> cc_addrs.
     *
     * @param userId    Authenticated owner user ID.
     * @param data      Draft body JSON.
     * @param onSuccess 201 with the message JSON.
     * @param onError   400/404/500 generic message.
     */
    void createDraft(
        const std::string& userId,
        const json& data,
        SyncCb onSuccess,
        SyncErrCb onError);
};

} // namespace services
