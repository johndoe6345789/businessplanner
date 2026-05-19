/**
 * @file authInitialState.ts
 * @brief Initial state builder for the auth slice.
 *        Hydrates user + accessToken from the Keycloak
 *        businessplanner_sso cookie so RTK Query has the right
 *        auth state on first render.
 */
import type { AuthState } from '../../types/auth';

/** Build the initial auth slice state. */
export function buildInitialAuthState(): AuthState {
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,
    requireTotp: false,
    totpSessionToken: null,
  };
}
