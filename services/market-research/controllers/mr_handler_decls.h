#pragma once
/**
 * @file mr_handler_decls.h
 * @brief Macro expanding to all method declarations
 *        for MarketResearchController.
 *        Included by MarketResearchController.h.
 */

#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <functional>
#include <string>

/**
 * @brief Declares all handler methods for the
 *        MarketResearchController class body.
 */
// clang-format off
#define MR_HANDLER_DECLS \
    /** @brief GET /api/market-research/tam */ \
    void getTam( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/market-research/tam */ \
    void saveTam( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief GET /api/market-research/competitors */\
    void listCompetitors( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief POST /api/market-research/competitors */\
    void createCompetitor( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT .../competitors/{id} */ \
    void updateCompetitor( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief DELETE .../competitors/{id} */ \
    void deleteCompetitor( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief GET /api/market-research/personas */ \
    void listPersonas( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief POST /api/market-research/personas */ \
    void createPersona( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT .../personas/{id} */ \
    void updatePersona( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief DELETE .../personas/{id} */ \
    void deletePersona( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief GET /api/market-research/discovery */ \
    void listDiscovery( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief POST /api/market-research/discovery */ \
    void createDiscovery( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief DELETE .../discovery/{id} */ \
    void deleteDiscovery( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief GET /api/market-research/bmc */ \
    void getBmc( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/market-research/bmc */ \
    void saveBmc( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb);
// clang-format on
