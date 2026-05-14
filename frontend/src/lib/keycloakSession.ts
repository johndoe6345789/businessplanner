/**
 * @file keycloakSession.ts
 * @brief Logout URL builder, JWT parser, session register.
 */
import cfg from '@/constants/keycloak.json';
import apiCfg from '@/constants/api.json';
import type { KeycloakJwtPayload } from './keycloakTypes';

/**
 * Build the Keycloak end-session URL.
 *
 * @param idTokenHint - id_token from the last login
 * @returns full URL for browser redirect
 */
export function logout(idTokenHint?: string): string {
  const p = new URLSearchParams({
    post_logout_redirect_uri: cfg.postLogoutRedirectUri,
    client_id: cfg.clientId,
  });
  if (idTokenHint) p.set('id_token_hint', idTokenHint);
  return `${cfg.endpoints.logout}?${p.toString()}`;
}

/**
 * Decode (without verifying) a JWT payload.
 *
 * @param token - JWT compact serialization
 */
export function parseJwt(
  token: string,
): KeycloakJwtPayload | null {
  try {
    const part = token.split('.')[1];
    const pad = part
      .replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(
      pad + '==='.slice((pad.length + 3) % 4),
    );
    return JSON.parse(json) as KeycloakJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Register a fresh access token's JTI with the backend
 * session store so JwtAuthFilter lets the token through.
 * Fire-and-forget — failures are silently ignored since
 * the next request will surface the 401 naturally.
 *
 * @param accessToken - JWT access token string
 */
export async function registerSession(
  accessToken: string,
): Promise<void> {
  try {
    await fetch(apiCfg.auth.sessionRegister, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    // Network error — the next API call will 401
    // and trigger re-auth.
  }
}
