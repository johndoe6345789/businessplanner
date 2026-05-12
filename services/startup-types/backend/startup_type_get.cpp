/**
 * @file startup_type_get.cpp
 * @brief getType — loads type + stages + traps.
 */

#include "StartupTypeService.h"
#include "startup_type_fetch.h"
#include <spdlog/spdlog.h>

namespace services::startup_types
{

static const std::string kGetType = R"(
    SELECT slug, name, description,
           icon, sort_order
    FROM startup_types WHERE slug = $1
)";

void StartupTypeService::getType(
    const std::string& slug,
    Callback ok, ErrCallback err)
{
    auto c = db();
    *c << kGetType << slug >>
        [=](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(drogon::k404NotFound,
                    "Startup type not found");
                return;
            }
            json base = {
                {"slug",
                 r[0]["slug"].as<std::string>()},
                {"name",
                 r[0]["name"].as<std::string>()},
                {"description",
                 r[0]["description"]
                     .as<std::string>()},
                {"icon",
                 r[0]["icon"].as<std::string>()},
                {"sortOrder",
                 r[0]["sort_order"].as<int>()},
            };
            fetchStagesAndTraps(
                c, slug, base, ok, err);
        } >>
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("startup get: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to load startup type");
        };
}

} // namespace services::startup_types
