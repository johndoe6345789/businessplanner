#pragma once
/**
 * @file StartupTypeController.h
 * @brief Read-only REST endpoints for startup-type
 *        reference data. No auth required.
 *        Implemented in StartupTypeController.cpp.
 */

#include <drogon/HttpController.h>

namespace controllers
{

class StartupTypeController
    : public drogon::HttpController<
          StartupTypeController>
{
  public:
    METHOD_LIST_BEGIN
    ADD_METHOD_TO(
        StartupTypeController::listTypes,
        "/api/startup-types",
        drogon::Get);
    ADD_METHOD_TO(
        StartupTypeController::getType,
        "/api/startup-types/{slug}",
        drogon::Get);
    METHOD_LIST_END

    /**
     * @brief GET /api/startup-types
     *        Returns all startup types ordered
     *        by sort_order.
     */
    void listTypes(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb);

    /**
     * @brief GET /api/startup-types/:slug
     *        Returns one type with stages + traps.
     * @param slug  URL path segment for the type.
     */
    void getType(
        const drogon::HttpRequestPtr& req,
        std::function<void(
            const drogon::HttpResponsePtr&)>&& cb,
        const std::string& slug);
};

} // namespace controllers
