#pragma once
/**
 * @file OrgController.h
 * @brief REST endpoints for the organisations domain.
 *        GET/POST /api/organisations
 *        PUT/DELETE /api/organisations/{id}
 *        All routes require JwtAuthFilter.
 *        Routes: org_routes.h
 *        Decls:  org_handler_decls.h
 */

#include "org_routes.h"
#include "org_handler_decls.h"
#include "organisations/backend/OrgStore.h"
#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief Controller for /api/organisations/*.
 */
class OrgController
    : public drogon::HttpController<OrgController>
{
  public:
    METHOD_LIST_BEGIN
    ORG_ROUTES(OrgController)
    METHOD_LIST_END

    ORG_HANDLER_DECLS

  private:
    services::organisations::OrgStore svc_;
};

} // namespace controllers
