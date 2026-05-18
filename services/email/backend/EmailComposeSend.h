#pragma once
/**
 * @file EmailComposeSend.h
 * @brief mailio SMTP submit for a loaded account.
 *
 * Split across EmailComposeSend / EmailComposeMessage /
 * EmailComposeTransport to keep every translation unit
 * under the 100 LOC ceiling. The send runs on the
 * caller's thread; callers detach + try/catch.
 */

#include "imap-sync/backend/imap_sync_types.h"

#include <drogon/orm/Row.h>
#include <mailio/message.hpp>

#include <cstdint>
#include <string>
#include <vector>

namespace services
{

/// @brief Resolved per-account SMTP transport params.
struct SmtpTarget
{
    std::string host;
    std::uint16_t port{587};
    std::string user;
    std::string pass;
    std::string encryption;
};

/// @brief Split a comma list into trimmed addresses.
auto splitAddrs(const std::string& s)
    -> std::vector<std::string>;

/// @brief Read a possibly-NULL string column.
auto col(const drogon::orm::Row& r, const char* c)
    -> std::string;

/**
 * @brief Build the mailio message from compose JSON.
 * @param from From address (account email).
 * @param data Compose body JSON.
 * @return Ready-to-submit message.
 */
auto buildComposeMessage(
    const std::string& from, const json& data)
    -> mailio::message;

/**
 * @brief Submit a message via per-account SMTP.
 * @param tgt Resolved transport params.
 * @param msg Message to send.
 * @throws std::exception on SMTP failure.
 */
void smtpSubmit(
    const SmtpTarget& tgt, mailio::message& msg);

/**
 * @brief Build message + submit + report result.
 *
 * From = account email; recipients = to + cc + bcc
 * (bcc not a header). Adds Date + Message-ID. Falls
 * back to SmtpConfig::fromEnv() host/port when
 * smtp_host is NULL. Never leaks SMTP error text.
 *
 * @param account   Owner-scoped account row.
 * @param data      Compose body JSON.
 * @param onSuccess {sent,to,subject} on accept.
 * @param onError   500 generic "Send failed".
 */
void composeSmtpSubmit(
    const drogon::orm::Row& account,
    const json& data,
    SyncCb onSuccess,
    SyncErrCb onError);

} // namespace services
