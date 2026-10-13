/**
 * @file keycloakUserMap.ts
 * @brief Derive an in-app User from a Keycloak JWT.
 *        Used when the SSO cookie is present so
 *        useAuth can skip the legacy /api/auth/me round
 *        trip entirely.
 */
import type { KeycloakJwtPayload } from '@/lib/keycloakTypes';
import { parseJwt } from '@/lib/keycloakClient';
import {
  COOKIE, readCookie,
} from '@/lib/keycloakCookies';
import { userIdFor } from '@/lib/userIdFor';
import type { User } from '@/types/auth';

const ROLES: ReadonlyArray<User['role']> = [
  'admin', 'moderator', 'user', 'guest',
];

/** dbal role names that carry admin rights. */
const ADMIN_ROLES = ['admin', 'god', 'supergod', 'owner'];

/** Collect role names from dbal's `role` or Keycloak's realm roles. */
function rawRoles(claims: KeycloakJwtPayload): string[] {
  const all = [...(claims.realm_access?.roles ?? [])];
  if (claims.role) all.push(claims.role);
  return all.map((x) => x.toLowerCase());
}

/** Pick the highest-priority known role. */
function pickRole(claims: KeycloakJwtPayload): User['role'] {
  const raw = rawRoles(claims);
  if (raw.some((x) => ADMIN_ROLES.includes(x))) return 'admin';
  for (const r of ROLES) {
    if (raw.includes(r)) return r;
  }
  return 'user';
}

/**
 * Map a decoded access-token payload to a User. dbal tokens
 * have no email/name claims and use the username as `sub`;
 * `id` is the UUID the API knows the user by.
 */
export function userFromKeycloakClaims(
  claims: KeycloakJwtPayload,
  now = '',
): User {
  const username =
    claims.preferred_username ?? claims.email ?? claims.sub;
  const display = claims.name ?? username;
  return {
    id: userIdFor(claims.iss, claims.sub),
    email:
      claims.email ??
      (claims.sub.includes('@') ? claims.sub : ''),
    username,
    displayName: display,
    role: pickRole(claims),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Read the Keycloak access token from the SSO
 * cookie and project its claims onto a User. Returns
 * null when the cookie is missing or the JWT is invalid.
 */
export function readKeycloakUser(): {
  user: User;
  accessToken: string;
} | null {
  const tok = readCookie(COOKIE.access);
  if (!tok) return null;
  const claims = parseJwt(tok);
  if (!claims) return null;
  return {
    user: userFromKeycloakClaims(claims),
    accessToken: tok,
  };
}
