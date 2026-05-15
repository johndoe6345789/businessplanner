#pragma once
/**
 * @file org_handler_decls.h
 * @brief Macro expanding to all method declarations
 *        for OrgController.
 */

#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <functional>
#include <string>

/**
 * @brief Declares all handler methods for
 *        the OrgController class body.
 */
// clang-format off
#define ORG_HANDLER_DECLS \
    /** @brief GET /api/organisations */ \
    void listOrgs( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief POST /api/organisations */ \
    void createOrg( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/organisations/{id} */ \
    void updateOrg( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief DELETE /api/organisations/{id} */ \
    void deleteOrg( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id);
// clang-format on
