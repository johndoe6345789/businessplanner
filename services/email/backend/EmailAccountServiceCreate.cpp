/// @file EmailAccountServiceCreate.cpp -- Account creation.
#include "email/backend/EmailAccountService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

static std::string pick(
    const json& d, const char* a, const char* b)
{
    if (d.contains(a) && d[a].is_string())
        return d[a].get<std::string>();
    if (d.contains(b) && d[b].is_string())
        return d[b].get<std::string>();
    return "";
}

void EmailAccountService::createAccount(
    const std::string& userId,
    const json& data,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        INSERT INTO email_accounts
        (user_id, account_name, email_address,
         imap_host, imap_port, imap_encryption,
         imap_user, imap_pass,
         smtp_host, smtp_port, smtp_encryption,
         smtp_user, smtp_pass)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
                $9, $10, $11, $12, $13)
        RETURNING id, account_name, email_address
    )";

    auto name = data.value("accountName", "");
    auto email = data.value("emailAddress", "");
    auto host = data.value("imapHost", "");
    auto port = data.value("imapPort", 993);
    auto enc = data.value("imapEncryption", "tls");
    auto user = pick(data, "imapUsername",
                     "imapUser");
    auto pass = pick(data, "imapPassword",
                     "imapPass");
    auto sHost = data.value("smtpHost", "");
    auto sPort = data.value("smtpPort", 587);
    auto sEnc =
        data.value("smtpEncryption", "tls");
    auto sUser = pick(data, "smtpUsername",
                      "smtpUser");
    auto sPass = pick(data, "smtpPassword",
                      "smtpPass");

    *db << sql << userId << name << email
        << host << port << enc << user << pass
        << sHost << sPort << sEnc << sUser << sPass
        >> [onSuccess](const Result& r) {
        auto row = r[0];
        onSuccess({
            {"id",
             row["id"].as<std::string>()},
            {"accountName",
             row["account_name"]
                 .as<std::string>()},
            {"emailAddress",
             row["email_address"]
                 .as<std::string>()},
        });
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("createAccount: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
