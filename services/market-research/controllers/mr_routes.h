#pragma once
/**
 * @file mr_routes.h
 * @brief ADD_METHOD_TO registrations for
 *        MarketResearchController.
 *        Included inside METHOD_LIST_BEGIN/END.
 */

// clang-format off
#define MR_ROUTES(C) \
    ADD_METHOD_TO(C::getTam, \
        "/api/market-research/tam", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::saveTam, \
        "/api/market-research/tam", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listCompetitors, \
        "/api/market-research/competitors", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::createCompetitor, \
        "/api/market-research/competitors", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::updateCompetitor, \
        "/api/market-research/competitors/{id}", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::deleteCompetitor, \
        "/api/market-research/competitors/{id}", \
        drogon::Delete, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listPersonas, \
        "/api/market-research/personas", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::createPersona, \
        "/api/market-research/personas", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::updatePersona, \
        "/api/market-research/personas/{id}", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::deletePersona, \
        "/api/market-research/personas/{id}", \
        drogon::Delete, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listDiscovery, \
        "/api/market-research/discovery", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::createDiscovery, \
        "/api/market-research/discovery", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::deleteDiscovery, \
        "/api/market-research/discovery/{id}", \
        drogon::Delete, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::getBmc, \
        "/api/market-research/bmc", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::saveBmc, \
        "/api/market-research/bmc", \
        drogon::Put, "filters::JwtAuthFilter");
// clang-format on
