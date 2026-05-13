#pragma once
/**
 * @file accel_routes.h
 * @brief ADD_METHOD_TO registrations for
 *        AcceleratorController.
 *        Included inside METHOD_LIST_BEGIN/END.
 */

// clang-format off
#define ACCEL_ROUTES(C) \
    ADD_METHOD_TO(C::listAccelerators, \
        "/api/accelerators", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::createAccelerator, \
        "/api/accelerators", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::updateAccelerator, \
        "/api/accelerators/{id}", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::deleteAccelerator, \
        "/api/accelerators/{id}", \
        drogon::Delete, "filters::JwtAuthFilter");
// clang-format on
