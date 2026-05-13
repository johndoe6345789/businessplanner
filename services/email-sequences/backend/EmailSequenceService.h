#pragma once
/**
 * @file EmailSequenceService.h
 * @brief Welcome drip and re-engagement email
 *        sequences for LaunchPad users.
 *
 * Called by: cron job via `services/cron/` or
 * manager CLI trigger.
 */

#include <chrono>
#include <functional>
#include <string>

namespace services::email_sequences
{

/**
 * @class EmailSequenceService
 * @brief Determines and sends due sequence emails.
 *
 * Reads sequence constants from
 * constants/email-sequences.json.  All DB I/O uses
 * Drogon async callbacks — never blocks the loop.
 */
class EmailSequenceService
{
  public:
    EmailSequenceService();
    ~EmailSequenceService() = default;

    /**
     * @brief Send the next welcome-drip email if due.
     *
     * Checks which day step (1, 3, 7) is due based on
     * joinedAt and lastSentDay.  Sends at most one step
     * per call.
     *
     * @param userId      UUID of the recipient user.
     * @param email       Recipient email address.
     * @param joinedAt    Account creation timestamp.
     * @param lastSentDay Last drip day already sent (0 if
     *                    none).
     * @param ok          Callback on success (day sent).
     * @param err         Callback on error (message).
     */
    void sendWelcomeDripIfDue(
        const std::string& userId,
        const std::string& email,
        std::chrono::system_clock::time_point joinedAt,
        int lastSentDay,
        std::function<void(int daySent)> ok,
        std::function<void(
            const std::string& msg)> err);

    /**
     * @brief Send re-engagement email if user dormant.
     *
     * Fires once after reengagementDormantDays of
     * inactivity and only if not already sent.
     *
     * @param userId      UUID of the recipient user.
     * @param email       Recipient email address.
     * @param lastActive  Timestamp of last activity.
     * @param alreadySent Whether email was sent before.
     * @param ok          Callback on send.
     * @param err         Callback on error.
     */
    void sendReengagementIfDue(
        const std::string& userId,
        const std::string& email,
        std::chrono::system_clock::time_point lastActive,
        bool alreadySent,
        std::function<void()> ok,
        std::function<void(
            const std::string& msg)> err);

  private:
    int dormantDays_{30};
};

} // namespace services::email_sequences
