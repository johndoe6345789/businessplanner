#pragma once
/// @file EmailInboxController.h
/// @brief REST endpoints for the email inbox:
/// message listing, detail, read/star flags, and
/// the IMAP sync trigger.

#include <drogon/HttpController.h>

namespace controllers
{

class EmailInboxController
    : public drogon::HttpController<
          EmailInboxController>
{
  public:
    /// Drogon response callback alias.
    using Cb = std::function<void(
        const drogon::HttpResponsePtr&)>;

    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        EmailInboxController::listMessages,
        "/api/email/messages",
        drogon::Get,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailInboxController::getMessage,
        "/api/email/messages/{id}",
        drogon::Get,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailInboxController::syncAccount,
        "/api/email/sync/{accountId}",
        drogon::Post,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailInboxController::markRead,
        "/api/email/messages/{id}/read",
        drogon::Put,
        "filters::CookieAuthFilter");
    ADD_METHOD_TO(
        EmailInboxController::toggleStar,
        "/api/email/messages/{id}/star",
        drogon::Put,
        "filters::CookieAuthFilter");
    METHOD_LIST_END

    /// @brief List owner messages (query:
    /// accountId, folder, page, pageSize).
    void listMessages(
        const drogon::HttpRequestPtr& req,
        Cb&& cb);

    /// @brief Get a single owned message by id.
    void getMessage(
        const drogon::HttpRequestPtr& req,
        Cb&& cb, const std::string& id);

    /// @brief Trigger IMAP sync for an account.
    void syncAccount(
        const drogon::HttpRequestPtr& req,
        Cb&& cb, const std::string& accountId);

    /// @brief Mark a message read/unread
    /// (body {isRead?:bool=true}).
    void markRead(
        const drogon::HttpRequestPtr& req,
        Cb&& cb, const std::string& id);

    /// @brief Set a message starred state
    /// (body {isStarred?:bool=true}).
    void toggleStar(
        const drogon::HttpRequestPtr& req,
        Cb&& cb, const std::string& id);
};

} // namespace controllers
