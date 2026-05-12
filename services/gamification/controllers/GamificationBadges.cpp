/**
 * @file GamificationBadges.cpp
 * @brief GET /api/gamification/badges handler.
 *
 * Returns all badges from the database.
 */

#include "GamificationController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <drogon/orm/DbClient.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <string>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;
using namespace drogon::orm;

namespace controllers
{

void GamificationController::listBadges(
    const drogon::HttpRequestPtr& /*req*/,
    Cb&& cb)
{
    auto db = drogon::app().getDbClient();
    const std::string sql =
        "SELECT id, name, description, "
        "       icon_url, category, "
        "       points_required, slug "
        "FROM badges "
        "ORDER BY points_required ASC, name ASC";

    *db << sql
        >> [cb](const Result& rows) {
            json badges = json::array();
            for (const auto& r : rows) {
                json b = {
                    {"id",
                     r["id"].as<std::string>()},
                    {"name",
                     r["name"].as<std::string>()},
                    {"description",
                     r["description"]
                      .as<std::string>()},
                    {"pointsRequired",
                     r["points_required"]
                      .as<int>()},
                };
                if (!r["icon_url"].isNull()) {
                    b["iconUrl"] =
                        r["icon_url"]
                         .as<std::string>();
                }
                if (!r["category"].isNull()) {
                    b["category"] =
                        r["category"]
                         .as<std::string>();
                }
                if (!r["slug"].isNull()) {
                    b["slug"] =
                        r["slug"].as<std::string>();
                }
                badges.push_back(b);
            }
            cb(::utils::jsonOk(
                {{"badges", badges}}));
        }
        >> [cb](const DrogonDbException& e) {
            spdlog::warn(
                "listBadges DB error: {}",
                e.base().what());
            cb(::utils::jsonError(
                drogon::k500InternalServerError,
                "Internal server error"));
        };
}

} // namespace controllers
