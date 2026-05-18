/// @file EmailDraftServiceCreate.cpp -- Draft insert.
#include "email/backend/EmailDraftService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

/// @brief JSON string field or "" (defensive).
static auto f(const json& d, const char* k)
    -> std::string
{
    return (d.contains(k) && d[k].is_string())
               ? d[k].get<std::string>()
               : std::string();
}

void EmailDraftService::createDraft(
    const std::string& userId,
    const json& data,
    SyncCb onSuccess, SyncErrCb onError)
{
    if (!data.is_object()) {
        onError(k400BadRequest,
                "Request body required");
        return;
    }
    auto accountId = f(data, "accountId");
    if (accountId.empty()) {
        onError(k400BadRequest,
                "accountId required");
        return;
    }

    auto db = drogon::app().getDbClient();
    // INSERT ... SELECT enforces ownership: the row
    // materializes only if the account is the
    // caller's, otherwise zero rows -> 404.
    const std::string sql = R"(
        INSERT INTO email_messages
        (account_id, folder, subject, from_addr,
         to_addrs, cc_addrs, body_text, body_html,
         is_draft)
        SELECT a.id, 'Drafts', $3, $4, $5, $6, $7,
               $8, true
        FROM email_accounts a
        WHERE a.id = $1::uuid
          AND a.user_id = $2::uuid
        RETURNING id, account_id, subject,
                  from_addr, to_addrs, cc_addrs,
                  body_text, body_html, folder,
                  is_draft
    )";

    *db << sql << accountId << userId
        << f(data, "subject") << f(data, "from")
        << f(data, "to") << f(data, "cc")
        << f(data, "body") << f(data, "bodyHtml")
        >> [onSuccess, onError](const Result& r) {
        if (r.empty()) {
            onError(k404NotFound,
                    "Account not found");
            return;
        }
        auto row = r[0];
        auto s = [&](const char* c) {
            return row[c].isNull()
                ? std::string()
                : row[c].as<std::string>();
        };
        onSuccess({
            {"id", s("id")},
            {"accountId", s("account_id")},
            {"folder", s("folder")},
            {"subject", s("subject")},
            {"from", s("from_addr")},
            {"to", s("to_addrs")},
            {"cc", s("cc_addrs")},
            {"bodyText", s("body_text")},
            {"bodyHtml", s("body_html")},
            {"isDraft",
             row["is_draft"].as<bool>()},
        });
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("createDraft: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
