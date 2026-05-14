#pragma once
/**
 * @file RiskAssessmentController.h
 * @brief REST endpoints for the risk-assessment
 *        domain.
 *        GET/POST /api/risk-assessment
 *        PUT/DELETE /api/risk-assessment/{id}
 *        All routes require JwtAuthFilter.
 *        Routes: risk_routes.h
 *        Decls:  risk_handler_decls.h
 *        Impls:  RiskReadController.cpp
 *                RiskMutController.cpp
 */

#include "risk_routes.h"
#include "risk_handler_decls.h"
#include "risk-assessment/backend/RiskAssessmentService.h"
#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief Controller for /api/risk-assessment/*.
 */
class RiskAssessmentController
    : public drogon::HttpController<
          RiskAssessmentController>
{
  public:
    METHOD_LIST_BEGIN
    RISK_ROUTES(RiskAssessmentController)
    METHOD_LIST_END

    RISK_HANDLER_DECLS

  private:
    services::risk_assessment::RiskAssessmentService
        svc_;
};

} // namespace controllers
