#pragma once
/**
 * @file LaunchPadNotifier.h
 * @brief Fire-and-forget notifications for LaunchPad-specific events.
 */

#include "notifications/backend/NotificationMutator.h"

#include <string>

namespace services
{

/**
 * @class LaunchPadNotifier
 * @brief Convenience wrappers that fire notifications for LaunchPad
 *        startup-tool events (stage gate, streak, co-founder, etc.).
 *
 * All methods are fire-and-forget: errors are logged but not
 * propagated to the caller.
 */
class LaunchPadNotifier
{
  public:
    LaunchPadNotifier() = default;
    ~LaunchPadNotifier() = default;

    /**
     * @brief Notify a user that they entered a new planner stage.
     *
     * @param userId Target user ID.
     * @param stage  Name of the stage just reached.
     */
    void notifyStageGateReached(const std::string& userId,
                                const std::string& stage);

    /**
     * @brief Warn a user that their streak expires within one hour.
     *
     * @param userId Target user ID.
     */
    void notifyStreakAtRisk(const std::string& userId);

    /**
     * @brief Notify a user that a co-founder joined their startup.
     *
     * @param userId        Target user ID.
     * @param coFounderName Display name of the new co-founder.
     */
    void notifyCoFounderJoined(const std::string& userId,
                               const std::string& coFounderName);

    /**
     * @brief Notify a user that they declared a new milestone.
     *
     * @param userId        Target user ID.
     * @param milestoneName Name of the milestone declared.
     */
    void notifyMilestoneDeclared(const std::string& userId,
                                 const std::string& milestoneName);

    /**
     * @brief Notify a user that their weekly startup review is due.
     *
     * @param userId Target user ID.
     */
    void notifyWeeklyReviewDue(const std::string& userId);

    /**
     * @brief Notify a user that someone commented on their planner step.
     *
     * @param userId        Target user ID.
     * @param commenterName Display name of the commenter.
     * @param stepTitle     Title of the step that was commented on.
     */
    void notifyPlannerStepCommented(const std::string& userId,
                                    const std::string& commenterName,
                                    const std::string& stepTitle);

  private:
    NotificationMutator mutator_;
};

} // namespace services
