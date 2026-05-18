/// @file EmailInboxService.cpp -- Message listing.
#include "email/backend/EmailInboxService.h"
#include "email/backend/EmailMessageJson.h"

#include <drogon/orm/DbClient.h>
#include <spdlog/spdlog.h>

namespace services
{

using namespace drogon;
using namespace drogon::orm;

void EmailInboxService::listMessages(
    const std::string& userId,
    const std::string& accountId,
    const std::string& folder,
    int page, int pageSize,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto db = drogon::app().getDbClient();
    int offset = (page - 1) * pageSize;

    const std::string base = R"(
        FROM email_messages m
        JOIN email_accounts a
          ON m.account_id = a.id
        WHERE a.user_id = $1::uuid
          AND m.folder = $2
          AND m.is_draft = FALSE
          AND ($3 = '' OR a.id = $3::uuid)
    )";

    const std::string sql =
        "SELECT m.* " + base +
        " ORDER BY m.date_recv DESC"
        " LIMIT $4::int OFFSET $5::int";
    const std::string cntSql =
        "SELECT COUNT(*) AS total " + base;

    *db << cntSql << userId << folder << accountId
        >> [=](const Result& cr) {
        long total = cr[0]["total"].as<long>();
        *db << sql << userId << folder << accountId
            << pageSize << offset
            >> [=](const Result& r) {
            json messages = json::array();
            for (const auto& row : r) {
                messages.push_back(
                    messageRowToJson(row));
            }
            onSuccess({
                {"messages", messages},
                {"total", total},
                {"page", page},
                {"pageSize", pageSize},
            });
        }
            >> [onError](
                const DrogonDbException& e) {
            spdlog::error("listMessages: {}",
                          e.base().what());
            onError(k500InternalServerError,
                    "Database error");
        };
    }
        >> [onError](const DrogonDbException& e) {
        spdlog::error("listMessages count: {}",
                      e.base().what());
        onError(k500InternalServerError,
                "Database error");
    };
}

} // namespace services
