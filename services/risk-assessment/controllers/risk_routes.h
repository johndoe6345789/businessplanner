#pragma once
/**
 * @file risk_routes.h
 * @brief ADD_METHOD_TO registrations for
 *        RiskAssessmentController.
 *        Included inside METHOD_LIST_BEGIN/END.
 */

// clang-format off
#define RISK_ROUTES(C) \
    ADD_METHOD_TO(C::listRisks, \
        "/api/risk-assessment", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::createRisk, \
        "/api/risk-assessment", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::updateRisk, \
        "/api/risk-assessment/{id}", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::deleteRisk, \
        "/api/risk-assessment/{id}", \
        drogon::Delete, "filters::JwtAuthFilter");
// clang-format on
