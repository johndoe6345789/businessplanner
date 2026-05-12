#pragma once
/**
 * @file MarketResearchController.h
 * @brief REST endpoints for market-research domain:
 *        TAM, competitors, personas, discovery, BMC.
 *        All routes require JwtAuthFilter.
 *        Routes: mr_routes.h. Decls: mr_handler_decls.h
 *        Implementations split across five .cpp files.
 */

#include "mr_routes.h"
#include "mr_handler_decls.h"

#include "market-research/backend/TamService.h"
#include "market-research/backend/CompetitorService.h"
#include "market-research/backend/PersonaService.h"
#include "market-research/backend/DiscoveryService.h"
#include "market-research/backend/BmcService.h"

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief Controller for /api/market-research/*.
 *        Implementations are in five .cpp files.
 */
class MarketResearchController
    : public drogon::HttpController<
          MarketResearchController>
{
  public:
    METHOD_LIST_BEGIN
    MR_ROUTES(MarketResearchController)
    METHOD_LIST_END

    MR_HANDLER_DECLS

  private:
    services::market_research::TamService tam_;
    services::market_research::CompetitorService
        competitors_;
    services::market_research::PersonaService
        personas_;
    services::market_research::DiscoveryService
        discovery_;
    services::market_research::BmcService bmc_;
};

} // namespace controllers
