/// @file EmailComposeMessage.cpp -- MIME assembly.
#include "email/backend/EmailComposeSend.h"

#include <boost/date_time/local_time/local_time.hpp>
#include <boost/date_time/posix_time/posix_time.hpp>

#include <random>
#include <string>

namespace services
{

/// @brief Read a JSON string field or "".
static auto fld(const json& d, const char* k)
    -> std::string
{
    return (d.contains(k) && d[k].is_string())
               ? d[k].get<std::string>()
               : std::string();
}

/// @brief Generate an RFC 5322 Message-ID value.
static auto makeMessageId(const std::string& from)
    -> std::string
{
    auto at = from.find('@');
    auto domain = at == std::string::npos
                      ? "localhost"
                      : from.substr(at + 1);
    std::random_device rd;
    std::mt19937_64 gen(rd());
    return "<" + std::to_string(gen()) + "."
           + std::to_string(gen()) + "@" + domain
           + ">";
}

auto buildComposeMessage(
    const std::string& from, const json& data)
    -> mailio::message
{
    auto to = fld(data, "to");
    auto cc = fld(data, "cc");
    auto bcc = fld(data, "bcc");
    auto replyTo = fld(data, "replyTo");
    auto body = fld(data, "body");
    auto html = fld(data, "bodyHtml");

    mailio::message msg;
    msg.from(mailio::mail_address("", from));
    msg.add_recipient(
        mailio::mail_address("", to));
    for (const auto& a : splitAddrs(cc))
        msg.add_cc_recipient(
            mailio::mail_address("", a));
    for (const auto& a : splitAddrs(bcc))
        msg.add_bcc_recipient(
            mailio::mail_address("", a));
    msg.subject(fld(data, "subject"));
    if (!replyTo.empty())
        msg.reply_address(
            mailio::mail_address("", replyTo));
    boost::local_time::local_date_time now(
        boost::posix_time::second_clock::universal_time(),
        boost::local_time::time_zone_ptr());
    msg.date_time(now);
    msg.message_id(makeMessageId(from));

    if (!html.empty()) {
        msg.content_type(
            mailio::message::media_type_t::
                MULTIPART,
            "alternative");
        mailio::mime tp, hp;
        tp.content_type(
            mailio::mime::media_type_t::TEXT,
            "plain", "utf-8");
        tp.content(body);
        hp.content_type(
            mailio::mime::media_type_t::TEXT,
            "html", "utf-8");
        hp.content(html);
        msg.add_part(tp);
        msg.add_part(hp);
    } else {
        msg.content_type(
            mailio::message::media_type_t::TEXT,
            "plain", "utf-8");
        msg.content(body);
    }
    return msg;
}

} // namespace services
