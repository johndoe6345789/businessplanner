#pragma once
/**
 * @file org_routes.h
 * @brief ADD_METHOD_TO registrations for
 *        OrgController.
 *        Included inside METHOD_LIST_BEGIN/END.
 */

// clang-format off
#define ORG_ROUTES(C) \
    ADD_METHOD_TO(C::listOrgs, \
        "/api/organisations", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::createOrg, \
        "/api/organisations", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::updateOrg, \
        "/api/organisations/{id}", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::deleteOrg, \
        "/api/organisations/{id}", \
        drogon::Delete, "filters::JwtAuthFilter");
// clang-format on
