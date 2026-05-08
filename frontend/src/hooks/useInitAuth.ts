'use client';
/**
 * @file useInitAuth.ts
 * @brief Bootstraps auth state from the Keycloak
 *        access-token cookie on app startup.
 *
 * The legacy /api/auth/sso-session endpoint always
 * returns 401 (Keycloak now owns auth end-to-end),
 * so we parse the token cookie directly — same
 * approach used by reauthViaKeycloak.
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCredentials,
  initComplete,
} from '@/store/slices/authSlice';
import { parseJwt } from '@/lib/keycloakClient';
import { COOKIE, readCookie }
  from '@/lib/keycloakCookies';
import type { User } from '@/types/auth';

/**
 * Reads the Keycloak access-token cookie once on
 * mount, derives the User shape from its claims,
 * and dispatches setCredentials into Redux.
 *
 * Falls back gracefully when no token is present.
 */
export function useInitAuth(): void {
  const dispatch = useDispatch();

  useEffect(() => {
    const tok = readCookie(COOKIE.access);
    if (tok) {
      const c = parseJwt(tok);
      if (c) {
        const roles =
          c.realm_access?.roles ?? [];
        const role: User['role'] =
          roles.includes('admin') ? 'admin'
          : roles.includes('moderator')
            ? 'moderator' : 'user';
        const user: User = {
          id: c.sub,
          email: c.email ?? '',
          username:
            c.preferred_username ?? '',
          displayName:
            c.name
            ?? c.preferred_username ?? '',
          role,
          createdAt: '',
          updatedAt: '',
        };
        dispatch(
          setCredentials({
            user,
            accessToken: tok,
          }),
        );
      }
    }
    dispatch(initComplete());
  }, [dispatch]);
}
