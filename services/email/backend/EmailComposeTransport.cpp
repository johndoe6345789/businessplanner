/// @file EmailComposeTransport.cpp -- SMTP connect.
#include "email/backend/EmailComposeSend.h"

#include <mailio/smtp.hpp>

namespace services
{

void smtpSubmit(
    const SmtpTarget& tgt, mailio::message& msg)
{
    // Encryption: 'ssl' -> implicit TLS (smtps);
    // 'tls'/'starttls' -> smtp + STARTTLS upgrade;
    // anything else -> plain SMTP. Auth uses LOGIN
    // only when a username is configured, else NONE
    // (mirrors the Flask conditional login()).
    if (tgt.encryption == "ssl") {
        mailio::smtps conn(tgt.host, tgt.port);
        conn.authenticate(
            tgt.user, tgt.pass,
            tgt.user.empty()
                ? mailio::smtps::auth_method_t::NONE
                : mailio::smtps::auth_method_t::
                      LOGIN);
        conn.submit(msg);
    } else if (tgt.encryption == "tls"
               || tgt.encryption == "starttls") {
        mailio::smtps conn(tgt.host, tgt.port);
        conn.authenticate(
            tgt.user, tgt.pass,
            tgt.user.empty()
                ? mailio::smtps::auth_method_t::
                      NONE
                : mailio::smtps::auth_method_t::
                      START_TLS);
        conn.submit(msg);
    } else {
        mailio::smtp conn(tgt.host, tgt.port);
        conn.authenticate(
            tgt.user, tgt.pass,
            tgt.user.empty()
                ? mailio::smtp::auth_method_t::NONE
                : mailio::smtp::auth_method_t::
                      LOGIN);
        conn.submit(msg);
    }
}

} // namespace services
