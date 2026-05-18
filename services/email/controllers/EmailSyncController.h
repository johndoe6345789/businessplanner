#pragma once
/**
 * @file EmailSyncController.h
 * @brief REST endpoints for IMAP folder listing
 *        and sync-status reporting.
 *
 * The sync trigger (POST) lives in
 * EmailInboxController; this controller serves
 * the two read-only sync endpoints.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class EmailSyncController
    : public drogon::HttpController<
          EmailSyncController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        EmailSyncController::listFolders,
        "/api/email/folders/{accountId}",
        drogon::Get,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailSyncController::syncStatus,
        "/api/email/sync/{accountId}/status",
        drogon::Get,
        "filters::CookieAuthFilter");
    METHOD_LIST_END

    /**
     * @brief List live IMAP folders.
     * @param req       Request (carries user_id).
     * @param cb        Response callback.
     * @param accountId Account UUID.
     */
    void listFolders(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb,
        const std::string& accountId);

    /**
     * @brief Report current sync state.
     * @param req       Request (carries user_id).
     * @param cb        Response callback.
     * @param accountId Account UUID.
     */
    void syncStatus(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb,
        const std::string& accountId);
};

} // namespace controllers
