#pragma once
/**
 * @file EmailComposeController.h
 * @brief REST endpoints for composing email.
 *
 * Send a message via the sender's own SMTP account
 * and list/create drafts. All routes are user-scoped
 * via CookieAuthFilter; the controller holds no SQL
 * and delegates to the compose/draft services.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class EmailComposeController
    : public drogon::HttpController<
          EmailComposeController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        EmailComposeController::sendEmail,
        "/api/email/compose",
        drogon::Post,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailComposeController::listDrafts,
        "/api/email/compose/drafts",
        drogon::Get,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailComposeController::createDraft,
        "/api/email/compose/drafts",
        drogon::Post,
        "filters::CookieAuthFilter");
    METHOD_LIST_END

    /**
     * @brief Send a composed email.
     * @param req JSON: accountId, to, subject, body,
     *            bodyHtml?, cc?, bcc?, replyTo?.
     * @param cb  Response callback.
     */
    void sendEmail(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);

    /**
     * @brief List the caller's drafts.
     * @param req Request.
     * @param cb  Response callback.
     */
    void listDrafts(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);

    /**
     * @brief Save a new draft.
     * @param req JSON: accountId?, subject?, from?,
     *            to?, cc?, body?, bodyHtml?.
     * @param cb  Response callback.
     */
    void createDraft(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);
};

} // namespace controllers
