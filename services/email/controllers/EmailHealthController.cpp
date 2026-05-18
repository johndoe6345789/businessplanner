/// @file EmailHealthController.cpp -- Health/version.
#include "EmailHealthController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void EmailHealthController::health(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    cb(::utils::jsonOk(json{
        {"service", "email-service"},
        {"status", "healthy"}}));
}

void EmailHealthController::version(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    cb(::utils::jsonOk(json{
        {"service", "Email Service"},
        {"version", "1.0.0"}}));
}

} // namespace controllers
