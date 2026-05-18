/// @file EmailComposeSend.cpp -- Send orchestration.
#include "email/backend/EmailComposeSend.h"
#include "email/backend/SmtpConfig.h"

#include <spdlog/spdlog.h>

#include <sstream>

namespace services
{

using namespace drogon::orm;

auto splitAddrs(const std::string& s)
    -> std::vector<std::string>
{
    std::vector<std::string> out;
    std::stringstream ss(s);
    std::string item;
    while (std::getline(ss, item, ',')) {
        auto a = item.find_first_not_of(" \t");
        auto b = item.find_last_not_of(" \t");
        if (a != std::string::npos)
            out.push_back(
                item.substr(a, b - a + 1));
    }
    return out;
}

auto col(const Row& r, const char* c)
    -> std::string
{
    return r[c].isNull() ? std::string()
                         : r[c].as<std::string>();
}

void composeSmtpSubmit(
    const Row& account, const json& data,
    SyncCb onSuccess, SyncErrCb onError)
{
    auto from = col(account, "email_address");
    auto to =
        (data.contains("to") && data["to"]
             .is_string())
            ? data["to"].get<std::string>()
            : std::string();
    auto subject =
        (data.contains("subject")
         && data["subject"].is_string())
            ? data["subject"].get<std::string>()
            : std::string();

    auto env = SmtpConfig::fromEnv();
    SmtpTarget tgt;
    tgt.host = col(account, "smtp_host");
    if (tgt.host.empty()) tgt.host = env.host;
    auto portS = col(account, "smtp_port");
    tgt.port =
        portS.empty()
            ? env.port
            : static_cast<std::uint16_t>(
                  std::stoi(portS));
    tgt.user = col(account, "smtp_user");
    tgt.pass = col(account, "smtp_pass");
    tgt.encryption =
        col(account, "smtp_encryption");

    try {
        auto msg =
            buildComposeMessage(from, data);
        smtpSubmit(tgt, msg);
        spdlog::info(
            "Sent email from {} to {} via {}:{}",
            from, to, tgt.host, tgt.port);
        onSuccess({{"sent", true},
                   {"to", to},
                   {"subject", subject}});
    } catch (const std::exception& e) {
        spdlog::error(
            "compose send failed: {}", e.what());
        onError(drogon::k500InternalServerError,
                "Send failed");
    } catch (...) {
        spdlog::error(
            "compose send failed: unknown");
        onError(drogon::k500InternalServerError,
                "Send failed");
    }
}

} // namespace services
