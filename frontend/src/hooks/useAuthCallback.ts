'use client';
/**
 * @file useAuthCallback.ts
 * @brief Encapsulates the Keycloak OIDC callback logic.
 *
 * Reads `code` + `state` from the URL, validates the PKCE
 * state cookie, exchanges the code for tokens, registers
 * the session with the backend, writes the cookies, then
 * redirects to the original target URL.
 */
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams }
  from 'next/navigation';
import { useLocale } from 'next-intl';
import { exchangeCode }
  from '@/lib/keycloakClient';
import { registerSession }
  from '@/lib/keycloakSession';
import {
  COOKIE, readCookie, writeCookie, clearCookie,
} from '@/lib/keycloakCookies';

interface StateCookie { state: string; next: string }

/**
 * Run the Keycloak OIDC code exchange once on mount.
 * Triggers a full-page reload to the destination URL.
 */
export function useAuthCallback(): void {
  const router = useRouter();
  const locale = useLocale();
  const search = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = search.get('code') ?? '';
    const recvState = search.get('state') ?? '';
    if (!code) {
      router.replace(`/${locale}/login?error=oidc`);
      return;
    }

    const verifier =
      readCookie(COOKIE.verifier) ?? '';
    const stRaw = readCookie(COOKIE.state);
    let next = recvState;
    if (verifier && stRaw) {
      let parsed: StateCookie;
      try {
        parsed = JSON.parse(stRaw) as StateCookie;
      } catch {
        parsed = { state: '', next: '' };
      }
      if (parsed.state !== recvState) {
        router.replace(
          `/${locale}/login?error=oidc`);
        return;
      }
      next = parsed.next || `/${locale}/dashboard`;
    }

    void (async () => {
      try {
        const tok =
          await exchangeCode(code, verifier);
        await registerSession(tok.access_token);
        writeCookie(COOKIE.access,
          tok.access_token, tok.expires_in);
        if (tok.refresh_token) {
          writeCookie(COOKIE.refresh,
            tok.refresh_token,
            tok.refresh_expires_in
              ?? tok.expires_in);
        }
        clearCookie(COOKIE.state);
        clearCookie(COOKIE.verifier);
        let target =
          next || `/${locale}/dashboard`;
        if (target.startsWith('/app/'))
          target = target.slice(4);
        else if (target === '/app')
          target = '/';
        const base =
          process.env.NEXT_PUBLIC_BASE_PATH ?? '';
        window.location.replace(`${base}${target}`);
      } catch {
        router.replace(
          `/${locale}/login?error=oidc`);
      }
    })();
  }, [router, locale, search]);
}
