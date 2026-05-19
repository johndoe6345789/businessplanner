#pragma once

/**
 * @file RouteHealthHandler.h
 * @brief Job handler that smoke-tests every app route
 *        and emits an alert for any 404 or 5xx response.
 *
 * Triggered nightly by the cron-manager via the
 * `routes.health_check` seed schedule.  The job payload
 * carries the portal base URL and the list of routes.
 */

#include "job-queue/backend/JobTypes.h"

namespace businessplanner::health
{

/**
 * @class RouteHealthHandler
 * @brief JobRegistry handler for `routes.health_check`.
 */
class RouteHealthHandler
{
public:
    /// Invoke synchronously; called by the worker pool.
    businessplanner::jobs::JobResult run(
        const businessplanner::jobs::QueuedJob& job) const;

    /// Convenience factory for registerHandler lambdas.
    static businessplanner::jobs::JobHandler makeHandler();
};

} // namespace businessplanner::health
