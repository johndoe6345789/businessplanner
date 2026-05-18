/// @file EmailSyncController.cpp
#include "EmailSyncController.h"
#include "imap-sync/backend/ImapSyncService.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <spdlog/spdlog.h>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void EmailSyncController::listFolders(
    const drogon::HttpRequestPtr& req,
    Cb&& cb, const std::string& accountId)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");

    services::ImapSyncService svc;
    svc.folders(accountId, userId,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

void EmailSyncController::syncStatus(
    const drogon::HttpRequestPtr& req,
    Cb&& cb, const std::string& accountId)
{
    auto userId = req->getAttributes()
        ->get<std::string>("user_id");

    services::ImapSyncService svc;
    svc.syncStatus(accountId, userId,
        [cb](const auto& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](auto code, const auto& msg) {
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
