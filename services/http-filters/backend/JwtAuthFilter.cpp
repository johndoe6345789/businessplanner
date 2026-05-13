/**
 * @brief JWT auth filter — Keycloak-only verification.
 *
 * Bearer tokens MUST be Keycloak-issued RS256 access
 * tokens. The legacy in-house HS256 path was removed in
 * Phase 4 of the Keycloak migration once all consumers
 * had migrated.
 *
 * After signature verification the token's `jti` claim is
 * validated against the user_sessions table so revoked
 * tokens are rejected immediately (9.1 session hardening).
 *
 * On success, exposes `user_id` and `user_role` in the
 * request attributes for downstream controllers.
 */
#include "JwtAuthFilter.h"
#include "session_check.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include "auth/backend/keycloak/KeycloakVerifier.h"
#include "auth/backend/keycloak/UserProvision.h"

#define JWT_DISABLE_PICOJSON
#include <jwt-cpp/traits/nlohmann-json/defaults.h>
#include <drogon/drogon.h>
#include <string>
#include <string_view>

namespace filters
{

namespace
{
constexpr std::string_view kBearerPrefix = "Bearer ";
}  // anonymous namespace

void JwtAuthFilter::doFilter(
    const drogon::HttpRequestPtr& req,
    drogon::FilterCallback&& cb,
    drogon::FilterChainCallback&& ccb)
{
    auto authHeader =
        req->getHeader("Authorization");
    if (authHeader.empty()) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Missing Authorization header",
            "AUTH_006"));
        return;
    }
    if (authHeader.substr(
            0, kBearerPrefix.size())
            != kBearerPrefix) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Invalid Authorization format",
            "AUTH_005"));
        return;
    }

    const auto token =
        authHeader.substr(kBearerPrefix.size());

    auto kc =
        services::auth::keycloak::defaultVerifier()
            .verify(token);
    if (!kc) {
        cb(::utils::jsonError(
            drogon::k401Unauthorized,
            "Invalid or expired token",
            "AUTH_005"));
        return;
    }

    // Extract jti for DB session validation. Tokens
    // without a jti bypass the session check — they are
    // still cryptographically valid but cannot be revoked.
    std::string jti;
    try {
        auto decoded = jwt::decode(token);
        if (decoded.has_id())
            jti = decoded.get_id();
    } catch (...) {}

    req->attributes()->insert("user_id", kc->sub);
    const std::string role =
        kc->roles.empty() ? std::string{"user"}
                          : kc->roles.front();
    req->attributes()->insert("user_role", role);
    services::auth::keycloak::ensureUserRow(*kc);

    if (jti.empty()) {
        // No jti claim — skip session store check.
        ccb();
        return;
    }
    // DB session check (9.1). v2: cache in Redis.
    checkSession(jti, std::move(cb), std::move(ccb));
}

}  // namespace filters
