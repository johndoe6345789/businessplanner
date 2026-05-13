#pragma once
/**
 * @file AcceleratorController.h
 * @brief REST endpoints for the accelerators domain.
 *        GET/POST /api/accelerators
 *        PUT/DELETE /api/accelerators/{id}
 *        All routes require JwtAuthFilter.
 *        Routes: accel_routes.h
 *        Decls:  accel_handler_decls.h
 *        Impls:  AcceleratorController.cpp
 */

#include "accel_routes.h"
#include "accel_handler_decls.h"
#include "accelerators/backend/AcceleratorService.h"
#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief Controller for /api/accelerators/*.
 */
class AcceleratorController
    : public drogon::HttpController<
          AcceleratorController>
{
  public:
    METHOD_LIST_BEGIN
    ACCEL_ROUTES(AcceleratorController)
    METHOD_LIST_END

    ACCEL_HANDLER_DECLS

  private:
    services::accelerators::AcceleratorService svc_;
};

} // namespace controllers
