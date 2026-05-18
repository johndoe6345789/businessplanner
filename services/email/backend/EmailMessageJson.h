#pragma once
/**
 * @file EmailMessageJson.h
 * @brief Map an email_messages row to camelCase
 *        JSON matching the Flask Message schema.
 */

#include <drogon/orm/Row.h>
#include <nlohmann/json.hpp>
#include <string>

namespace services
{

using json = nlohmann::json;

/**
 * @brief Read a column as string or JSON null.
 * @param row  Result row.
 * @param col  Column name.
 * @return String value, or null if SQL NULL.
 */
inline auto colStrOrNull(
    const drogon::orm::Row& row,
    const char* col) -> json
{
    const auto& f = row[col];
    if (f.isNull()) return nullptr;
    return f.template as<std::string>();
}

/**
 * @brief Convert a message row to camelCase JSON.
 * @param row  email_messages result row.
 * @return Message JSON (Flask-parity keys).
 */
inline auto messageRowToJson(
    const drogon::orm::Row& row) -> json
{
    return {
        {"id",
         row["id"].as<std::string>()},
        {"accountId",
         row["account_id"].as<std::string>()},
        {"messageId",
         colStrOrNull(row, "message_id")},
        {"uid", row["uid"].isNull()
             ? json(nullptr)
             : json(row["uid"].as<int>())},
        {"folder",
         row["folder"].as<std::string>()},
        {"subject",
         colStrOrNull(row, "subject")},
        {"from",
         colStrOrNull(row, "from_addr")},
        {"to",
         colStrOrNull(row, "to_addrs")},
        {"cc",
         colStrOrNull(row, "cc_addrs")},
        {"bcc",
         colStrOrNull(row, "bcc_addrs")},
        {"bodyText",
         colStrOrNull(row, "body_text")},
        {"bodyHtml",
         colStrOrNull(row, "body_html")},
        {"hasAttachments",
         row["has_attach"].as<bool>()},
        {"isRead",
         row["is_read"].as<bool>()},
        {"isStarred",
         row["is_starred"].as<bool>()},
        {"isDraft",
         row["is_draft"].as<bool>()},
        {"dateSent",
         colStrOrNull(row, "date_sent")},
        {"dateReceived",
         colStrOrNull(row, "date_recv")},
    };
}

} // namespace services
