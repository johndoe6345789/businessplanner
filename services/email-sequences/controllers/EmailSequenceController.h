#pragma once
/**
 * @file EmailSequenceController.h
 * @brief Admin trigger + opt-out endpoints for
 *        email sequences.
 */

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @class EmailSequenceController
 * @brief Exposes:
 *   POST   /api/email-sequences/trigger-drip
 *          Admin-only: manually trigger a drip for a
 *          given user_id.
 *   DELETE /api/email-sequences/opt-out
 *          JWT-protected: mark calling user opted out.
 */
class EmailSequenceController
    : public drogon::HttpController<
        EmailSequenceController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        EmailSequenceController::triggerDrip,
        "/api/email-sequences/trigger-drip",
        drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        EmailSequenceController::optOut,
        "/api/email-sequences/opt-out",
        drogon::Delete,
        "filters::JwtAuthFilter");
    METHOD_LIST_END

    /**
     * @brief Manually trigger welcome drip for a user.
     * @param req  Must contain body: { "user_id": "..." }
     *             Caller must have admin role.
     * @param cb   Response callback.
     */
    void triggerDrip(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /**
     * @brief Opt the authenticated user out of sequences.
     * @param req  JWT bearer token required.
     * @param cb   Response callback.
     */
    void optOut(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);
};

} // namespace controllers
