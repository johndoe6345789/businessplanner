/// @file EmailDraftService.cpp -- Draft listing.
#include "email/backend/EmailDraftService.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailDraftService::listDrafts(
    const std::string& userId,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    const std::string sql = R"(
        SELECT m.id, m.account_id, m.message_id,
               m.uid, m.folder, m.subject,
               m.from_addr, m.to_addrs, m.cc_addrs,
               m.bcc_addrs, m.body_text,
               m.body_html, m.has_attach,
               m.is_read, m.is_starred,
               m.is_draft, m.date_sent,
               m.date_recv
        FROM email_messages m
        JOIN email_accounts a
          ON a.id = m.account_id
        WHERE a.user_id = $1::uuid
          AND m.is_draft = true
        ORDER BY m.created_at DESC
    )";

    *db << sql << userId
        >> [onSuccess](const Result& r) {
        auto s = [](const Row& row,
                    const char* c) {
            return row[c].isNull()
                ? std::string()
                : row[c].as<std::string>();
        };
        json drafts = json::array();
        for (const auto& row : r) {
            drafts.push_back({
                {"id", s(row, "id")},
                {"accountId",
                 s(row, "account_id")},
                {"messageId",
                 s(row, "message_id")},
                {"folder", s(row, "folder")},
                {"subject", s(row, "subject")},
                {"from", s(row, "from_addr")},
                {"to", s(row, "to_addrs")},
                {"cc", s(row, "cc_addrs")},
                {"bcc", s(row, "bcc_addrs")},
                {"bodyText",
                 s(row, "body_text")},
                {"bodyHtml",
                 s(row, "body_html")},
                {"isDraft",
                 row["is_draft"].as<bool>()},
            });
        }
        onSuccess({{"drafts", drafts}});
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("listDrafts: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
