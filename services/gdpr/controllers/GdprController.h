#pragma once
/**
 * @file GdprController.h
 * @brief REST endpoints for GDPR data rights.
 *        GET  /api/gdpr/export  — right of access.
 *        DELETE /api/gdpr/account — right to erasure.
 *        Both routes require JwtAuthFilter.
 */

#include "gdpr/backend/GdprExportService.h"
#include "gdpr/backend/GdprDeleteService.h"

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief Controller for /api/gdpr/* endpoints.
 */
class GdprController
    : public drogon::HttpController<GdprController>
{
  public:
    // clang-format off
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(GdprController::exportData,
        "/api/gdpr/export",
        drogon::Get,
        "filters::JwtAuthFilter");
    ADD_METHOD_TO(GdprController::deleteAccount,
        "/api/gdpr/account",
        drogon::Delete,
        "filters::JwtAuthFilter");
    METHOD_LIST_END
    // clang-format on

    /**
     * @brief Export all data for the authenticated user.
     * @param req  Incoming HTTP request.
     * @param cb   Response callback.
     */
    void exportData(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /**
     * @brief Permanently delete the authenticated
     *        user's account and all associated data.
     * @param req  Incoming HTTP request.
     * @param cb   Response callback.
     */
    void deleteAccount(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

  private:
    services::gdpr::GdprExportService export_;
    services::gdpr::GdprDeleteService delete_;
};

} // namespace controllers
