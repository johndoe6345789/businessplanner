/**
 * @file email_sequence_service.cpp
 * @brief Welcome drip and re-engagement logic.
 *
 * Called by: cron job via `services/cron/` or
 * manager CLI trigger.
 */

#include "EmailSequenceService.h"
#include "email/backend/EmailService.h"

#include <spdlog/spdlog.h>

#include <array>
#include <chrono>

namespace services::email_sequences
{

namespace
{

using Clock = std::chrono::system_clock;
using Days  = std::chrono::duration<int,
    std::ratio<86400>>;

constexpr std::array<int, 3> DRIP_DAYS{1, 3, 7};

int daysSince(Clock::time_point tp)
{
    auto diff = Clock::now() - tp;
    return std::chrono::duration_cast<Days>(
        diff).count();
}

} // anonymous namespace

EmailSequenceService::EmailSequenceService()
    : dormantDays_{30}
{}

void EmailSequenceService::sendWelcomeDripIfDue(
    const std::string& userId,
    const std::string& email,
    Clock::time_point joinedAt,
    int lastSentDay,
    std::function<void(int)> ok,
    std::function<void(const std::string&)> err)
{
    const int elapsed = daysSince(joinedAt);
    for (int day : DRIP_DAYS) {
        if (day <= lastSentDay) continue;
        if (elapsed < day)     continue;
        spdlog::info(
            "email-seq: drip day {} for user {}",
            day, userId);
        services::EmailService svc;
        bool sent = svc.sendEmail(
            email, "Welcome to LaunchPad",
            "<p>Day " + std::to_string(day)
            + " check-in.</p>");
        if (!sent) {
            err("SMTP send failed for day "
                + std::to_string(day));
            return;
        }
        ok(day);
        return;
    }
    ok(0); // nothing due
}

void EmailSequenceService::sendReengagementIfDue(
    const std::string& userId,
    const std::string& email,
    Clock::time_point lastActive,
    bool alreadySent,
    std::function<void()> ok,
    std::function<void(const std::string&)> err)
{
    if (alreadySent) { ok(); return; }
    if (daysSince(lastActive) < dormantDays_) {
        ok(); return;
    }
    spdlog::info(
        "email-seq: re-engagement for user {}",
        userId);
    services::EmailService svc;
    bool sent = svc.sendEmail(
        email,
        "We miss you! Your startup plan is waiting",
        "<p>Come back and keep building.</p>");
    if (!sent) {
        err("SMTP re-engagement send failed");
        return;
    }
    ok();
}

} // namespace services::email_sequences
