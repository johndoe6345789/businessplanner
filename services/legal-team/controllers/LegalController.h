#pragma once
/**
 * @file LegalController.h
 * @brief REST endpoints for equity split and
 *        vesting schedule calculations.
 *        Implemented in LegalController.cpp.
 */

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief Handles POST /api/legal/equity/split
 *        and POST /api/legal/equity/vesting.
 *        Both endpoints are stateless — no DB.
 */
class LegalController
    : public drogon::HttpController<
          LegalController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        LegalController::equitySplit,
        "/api/legal/equity/split",
        drogon::Post);
    ADD_METHOD_TO(
        LegalController::equityVesting,
        "/api/legal/equity/vesting",
        drogon::Post);
    METHOD_LIST_END

    /**
     * @brief POST /api/legal/equity/split
     *        Computes equity percentage for each
     *        founder based on role, time, capital,
     *        idea, and experience weights.
     * @param req  HTTP request with JSON body.
     * @param cb   Response callback.
     */
    void equitySplit(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&&
            cb);

    /**
     * @brief POST /api/legal/equity/vesting
     *        Generates a monthly vesting schedule
     *        with cliff and optional acceleration.
     * @param req  HTTP request with JSON body.
     * @param cb   Response callback.
     */
    void equityVesting(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&&
            cb);
};

} // namespace controllers
