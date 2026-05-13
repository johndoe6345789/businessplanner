#pragma once
/**
 * @file accel_handler_decls.h
 * @brief Macro expanding to all method declarations
 *        for AcceleratorController.
 *        Included by AcceleratorController.h.
 */

#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <functional>
#include <string>

/**
 * @brief Declares all handler methods for the
 *        AcceleratorController class body.
 */
// clang-format off
#define ACCEL_HANDLER_DECLS \
    /** @brief GET /api/accelerators */ \
    void listAccelerators( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief POST /api/accelerators */ \
    void createAccelerator( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/accelerators/{id} */ \
    void updateAccelerator( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief DELETE /api/accelerators/{id} */ \
    void deleteAccelerator( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id);
// clang-format on
