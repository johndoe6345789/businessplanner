#pragma once
/**
 * @file EmailHealthController.h
 * @brief Unauthenticated email health/version.
 *
 * Liveness + version probes for the email domain.
 * No auth filter (matches the Flask health blueprint
 * which is mounted without tenant/auth checks).
 */

#include <drogon/HttpController.h>

namespace controllers
{

class EmailHealthController
    : public drogon::HttpController<
          EmailHealthController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        EmailHealthController::health,
        "/api/email/health",
        drogon::Get);
    ADD_METHOD_TO(
        EmailHealthController::version,
        "/api/email/version",
        drogon::Get);
    METHOD_LIST_END

    /**
     * @brief Liveness probe.
     * @param req Request.
     * @param cb  Response callback.
     */
    void health(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);

    /**
     * @brief Service version.
     * @param req Request.
     * @param cb  Response callback.
     */
    void version(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&
        )>&& cb);
};

} // namespace controllers
