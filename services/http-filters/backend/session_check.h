#pragma once
/**
 * @file session_check.h
 * @brief Helper: validate a JTI against the session store.
 *
 * Extracted from JwtAuthFilter to keep that file under the
 * 100-line limit. Calls SessionStore::isSessionValid and
 * invokes the appropriate Drogon callback.
 *
 * NOTE(v2): Replace the DB query here with a Redis cache
 * lookup to eliminate the per-request DB round-trip.
 */

#include "auth/backend/SessionStore.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <drogon/drogon.h>
#include <string>
#include <utility>

namespace filters
{

/**
 * @brief Asynchronously validate a session by JTI.
 *
 * Calls ok(ccb) if the session is active, otherwise calls
 * cb with a 401 response. Fails closed on DB error.
 *
 * @param jti  JWT ID claim extracted from the token.
 * @param cb   Drogon filter-deny callback.
 * @param ccb  Drogon filter-chain (continue) callback.
 */
inline void checkSession(
    const std::string& jti,
    drogon::FilterCallback cb,
    drogon::FilterChainCallback ccb)
{
    services::auth::SessionStore::isSessionValid(
        jti,
        [cb = std::move(cb),
         ccb = std::move(ccb)](bool valid) mutable {
            if (!valid) {
                cb(::utils::jsonError(
                    drogon::k401Unauthorized,
                    "Session revoked or expired",
                    "AUTH_008"));
                return;
            }
            ccb();
        },
        [cb = std::move(cb)](
            const std::string&) mutable {
            cb(::utils::jsonError(
                drogon::k401Unauthorized,
                "Authentication service unavailable",
                "AUTH_009"));
        });
}

} // namespace filters
