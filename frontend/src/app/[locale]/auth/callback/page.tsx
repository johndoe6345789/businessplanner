'use client';

/**
 * @file page.tsx (auth/callback)
 * @brief Keycloak OIDC redirect handler.
 *
 * Two entry paths converge here:
 *  1. Server-side 302 from /app/en/login (no PKCE).
 *     `state` is the original `next` URL (a path).
 *  2. Client-side login() from useKeycloak() (with
 *     PKCE). `state` is a random token persisted in
 *     the businessplanner_sso_state cookie alongside the
 *     PKCE verifier.
 *
 * Logic is encapsulated in useAuthCallback so this
 * component stays under the 100-line limit.
 */
import type { ReactElement } from 'react';
import { CircularProgress } from '@shared/m3';
import { useAuthCallback }
  from '@/hooks/useAuthCallback';

/**
 * @returns Spinner shown while exchange is in flight.
 */
export default function KeycloakCallbackPage():
ReactElement {
  useAuthCallback();

  return (
    <div
      data-testid="keycloak-callback"
      role="status"
      aria-label="Completing Keycloak sign-in"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100dvh',
      }}
    >
      <CircularProgress
        testId="kc-callback-spinner" />
    </div>
  );
}
