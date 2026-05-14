#pragma once
/**
 * @file risk_handler_decls.h
 * @brief Macro expanding to all method declarations
 *        for RiskAssessmentController.
 *        Included by RiskAssessmentController.h.
 */

#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <functional>
#include <string>

/**
 * @brief Declares all handler methods for the
 *        RiskAssessmentController class body.
 */
// clang-format off
#define RISK_HANDLER_DECLS \
    /** @brief GET /api/risk-assessment */ \
    void listRisks( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief POST /api/risk-assessment */ \
    void createRisk( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/risk-assessment/{id} */ \
    void updateRisk( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief DELETE /api/risk-assessment/{id} */ \
    void deleteRisk( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id);
// clang-format on
