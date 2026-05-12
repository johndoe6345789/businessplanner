/**
 * @file LegalController.cpp
 * @brief Implements POST /api/legal/equity/split
 *        and POST /api/legal/equity/vesting.
 */

#include "LegalController.h"
#include "legal-team/backend/EquityService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

namespace controllers
{

using services::legal_team::EquityService;

void LegalController::equitySplit(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto bodyPtr = req->getJsonObject();
    if (!bodyPtr
        || !bodyPtr->isMember("founders")) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Request body must contain "
            "'founders' array"));
        return;
    }

    auto founders = nlohmann::json::parse(
        (*bodyPtr)["founders"].toStyledString());

    EquityService svc;
    svc.calcSplit(
        founders,
        [cb](
            const services::legal_team::json&
                d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void LegalController::equityVesting(
    const drogon::HttpRequestPtr& req,
    std::function<void(
        const drogon::HttpResponsePtr&)>&& cb)
{
    auto bodyPtr = req->getJsonObject();
    if (!bodyPtr) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "Request body must be a JSON object"));
        return;
    }

    auto params = nlohmann::json::parse(
        bodyPtr->toStyledString());

    EquityService svc;
    svc.calcVesting(
        params,
        [cb](
            const services::legal_team::json&
                d) {
            cb(::utils::jsonOk(d));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
