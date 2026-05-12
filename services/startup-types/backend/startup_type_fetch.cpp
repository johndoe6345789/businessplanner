/**
 * @file startup_type_fetch.cpp
 * @brief Load stages then traps for a type.
 */

#include "startup_type_fetch.h"
#include <spdlog/spdlog.h>

namespace services::startup_types
{

static const std::string kStages = R"(
    SELECT slug, name, description,
           display_order
    FROM startup_type_stages
    WHERE startup_type_slug = $1
    ORDER BY display_order
)";

static const std::string kTraps = R"(
    SELECT description
    FROM startup_type_traps
    WHERE startup_type_slug = $1
    ORDER BY sort_order
)";

void fetchStagesAndTraps(
    const drogon::orm::DbClientPtr& c,
    const std::string& slug,
    json base,
    Callback ok,
    ErrCallback err)
{
    *c << kStages << slug >>
        [=](const drogon::orm::Result& r) {
            auto stages = json::array();
            for (const auto& row : r) {
                stages.push_back({
                    {"slug",
                     row["slug"]
                         .as<std::string>()},
                    {"name",
                     row["name"]
                         .as<std::string>()},
                    {"description",
                     row["description"]
                         .as<std::string>()},
                    {"displayOrder",
                     row["display_order"]
                         .as<int>()},
                });
            }
            auto t = base;
            t["stages"] = stages;
            *c << kTraps << slug >>
                [ok, t](
                    const drogon::orm::Result& tr) {
                    auto traps = json::array();
                    for (const auto& row : tr) {
                        traps.push_back(
                            row["description"]
                                .as<std::string>());
                    }
                    auto final = t;
                    final["traps"] = traps;
                    ok(final);
                } >>
                [err](
                    const drogon::orm::
                        DrogonDbException& e) {
                    spdlog::error(
                        "startup traps: {}",
                        e.base().what());
                    err(
                        drogon::
                        k500InternalServerError,
                        "Failed to load traps");
                };
        } >>
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("startup stages: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to load stages");
        };
}

} // namespace services::startup_types
