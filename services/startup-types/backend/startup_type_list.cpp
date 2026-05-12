/**
 * @file startup_type_list.cpp
 * @brief listTypes implementation for
 *        StartupTypeService.
 */

#include "StartupTypeService.h"
#include <spdlog/spdlog.h>

namespace services::startup_types
{

static const std::string kListTypes = R"(
    SELECT slug, name, description,
           icon, sort_order
    FROM startup_types
    ORDER BY sort_order
)";

void StartupTypeService::listTypes(
    Callback ok, ErrCallback err)
{
    *db() << kListTypes >>
        [ok](const drogon::orm::Result& r) {
            auto arr = json::array();
            for (const auto& row : r) {
                arr.push_back({
                    {"slug",
                     row["slug"]
                         .as<std::string>()},
                    {"name",
                     row["name"]
                         .as<std::string>()},
                    {"description",
                     row["description"]
                         .as<std::string>()},
                    {"icon",
                     row["icon"]
                         .as<std::string>()},
                    {"sortOrder",
                     row["sort_order"]
                         .as<int>()},
                });
            }
            ok({{"types", arr}});
        } >>
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("startup_types list: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to list startup types");
        };
}

} // namespace services::startup_types
