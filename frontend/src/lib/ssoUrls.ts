/**
 * @file ssoUrls.ts
 * @brief Absolute redirect URLs for the dbal SSO client,
 *        built from the current origin so one build works
 *        on any domain registered with dbal.
 */
import cfg from '@/constants/keycloak.json';

/** OAuth redirect_uri for the auth callback page. */
export function redirectUri(): string {
  return `${window.location.origin}${cfg.redirectPath}`;
}

/** Where dbal sends the browser after logout. */
export function postLogoutRedirectUri(): string {
  return `${window.location.origin}${cfg.postLogoutPath}`;
}
