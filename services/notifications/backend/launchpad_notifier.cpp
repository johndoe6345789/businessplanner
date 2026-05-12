/**
 * @file launchpad_notifier.cpp
 * @brief Fire-and-forget LaunchPad event notifications.
 * Body/title templates are constexpr (not user-facing UI text); canonical
 * forms live in constants/launchpad-events.json for reference.
 */

#include "notifications/backend/LaunchPadNotifier.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <string_view>
namespace services
{
namespace
{
constexpr std::string_view kStageTpl      = "Stage Reached: {}";
constexpr std::string_view kStageBody     =
    "You've entered the {} stage. Check your planner for new steps.";
constexpr std::string_view kStreakTitle   = "Streak at Risk!";
constexpr std::string_view kStreakBody    =
    "Your streak ends in less than 1 hour. Log in now to keep it going.";
constexpr std::string_view kCoFounderTitle = "Co-founder Joined";
constexpr std::string_view kCoFounderBody  =
    "{} has joined your startup as co-founder.";
constexpr std::string_view kMilestoneTpl  = "Milestone: {}";
constexpr std::string_view kMilestoneBody = "You've declared a new milestone: {}";
constexpr std::string_view kWeeklyTitle   = "Weekly Review Due";
constexpr std::string_view kWeeklyBody    =
    "It's time for your weekly startup review. Keep your plan current.";
constexpr std::string_view kCommentTitle  = "New comment on your step";
constexpr std::string_view kCommentBody   = "{} commented on: {}";
} // namespace

void LaunchPadNotifier::notifyStageGateReached(const std::string& userId,
                                               const std::string& stage)
{
    mutator_.createNotification(
        userId, fmt::format(kStageTpl, stage),
        fmt::format(kStageBody, stage), "stage_gate", {{"stage", stage}},
        [](const json&) {},
        [](drogon::HttpStatusCode, const std::string& err) {
            spdlog::error("notifyStageGateReached failed: {}", err); });
}

void LaunchPadNotifier::notifyStreakAtRisk(const std::string& userId)
{
    mutator_.createNotification(
        userId, std::string(kStreakTitle), std::string(kStreakBody),
        "streak_warning", {}, [](const json&) {},
        [](drogon::HttpStatusCode, const std::string& err) {
            spdlog::error("notifyStreakAtRisk failed: {}", err); });
}

void LaunchPadNotifier::notifyCoFounderJoined(
    const std::string& userId, const std::string& coFounderName)
{
    mutator_.createNotification(
        userId, std::string(kCoFounderTitle),
        fmt::format(kCoFounderBody, coFounderName),
        "co_founder", {{"name", coFounderName}}, [](const json&) {},
        [](drogon::HttpStatusCode, const std::string& err) {
            spdlog::error("notifyCoFounderJoined failed: {}", err); });
}

void LaunchPadNotifier::notifyMilestoneDeclared(
    const std::string& userId, const std::string& milestoneName)
{
    mutator_.createNotification(
        userId, fmt::format(kMilestoneTpl, milestoneName),
        fmt::format(kMilestoneBody, milestoneName),
        "milestone", {{"name", milestoneName}}, [](const json&) {},
        [](drogon::HttpStatusCode, const std::string& err) {
            spdlog::error("notifyMilestoneDeclared failed: {}", err); });
}

void LaunchPadNotifier::notifyWeeklyReviewDue(const std::string& userId)
{
    mutator_.createNotification(
        userId, std::string(kWeeklyTitle), std::string(kWeeklyBody),
        "weekly_review", {}, [](const json&) {},
        [](drogon::HttpStatusCode, const std::string& err) {
            spdlog::error("notifyWeeklyReviewDue failed: {}", err); });
}

void LaunchPadNotifier::notifyPlannerStepCommented(
    const std::string& userId, const std::string& commenterName,
    const std::string& stepTitle)
{
    mutator_.createNotification(
        userId, std::string(kCommentTitle),
        fmt::format(kCommentBody, commenterName, stepTitle),
        "comment", {{"commenter", commenterName}, {"step", stepTitle}},
        [](const json&) {},
        [](drogon::HttpStatusCode, const std::string& err) {
            spdlog::error("notifyPlannerStepCommented failed: {}", err); });
}

} // namespace services
