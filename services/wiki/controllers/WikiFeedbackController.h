#pragma once
/**
 * @file WikiFeedbackController.h
 * @brief Helpful/unhelpful votes on KB articles.
 *
 * POST /api/wiki/kb/{id}/feedback
 *   JWT-protected. Body: { "helpful": true|false }
 *   Upserts a vote for the authenticated user.
 *
 * GET  /api/wiki/kb/{id}/feedback-summary
 *   Public. Returns { "helpful": N, "unhelpful": M }.
 */

#include <drogon/HttpController.h>
#include <string>

namespace controllers
{

/**
 * @class WikiFeedbackController
 * @brief KB article feedback (thumbs up/down) endpoints.
 */
class WikiFeedbackController
    : public drogon::HttpController<
        WikiFeedbackController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        WikiFeedbackController::submitFeedback,
        "/api/wiki/kb/{id}/feedback",
        drogon::Post,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(
        WikiFeedbackController::getFeedbackSummary,
        "/api/wiki/kb/{id}/feedback-summary",
        drogon::Get);
    METHOD_LIST_END

    /**
     * @brief Upsert a helpful/unhelpful vote.
     * @param req  Body: { "helpful": bool }
     * @param cb   Response callback.
     * @param id   KB page ID (string representation of
     *             BIGINT).
     */
    void submitFeedback(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);

    /**
     * @brief Return aggregate helpful/unhelpful counts.
     * @param req  No auth required.
     * @param cb   Response callback.
     * @param id   KB page ID.
     */
    void getFeedbackSummary(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& id);
};

} // namespace controllers
