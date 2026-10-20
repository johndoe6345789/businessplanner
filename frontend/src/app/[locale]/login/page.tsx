'use client';

import { Suspense, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircularProgress } from '@shared/m3';
import KeycloakLoginButton from
  '@/components/molecules/KeycloakLoginButton';
import { useKeycloak } from '@/hooks/useKeycloak';

/**
 * Starts the OIDC authorization-code + PKCE flow.
 *
 * dbal requires PKCE, so the code verifier has to be kept in the
 * browser: the login redirect cannot be built on the server. After a
 * failed sign-in the callback sends the user back here with ?error=,
 * so that case shows a button instead of retrying forever.
 */
function StartLogin(): ReactElement {
  const search = useSearchParams();
  const { login, isAuthenticated } = useKeycloak();
  const started = useRef(false);
  const raw = search.get('next');
  const next =
    raw && raw.startsWith('/') && !raw.startsWith('//')
      ? raw : undefined;
  const failed = search.has('error');

  useEffect(() => {
    if (started.current || failed || isAuthenticated) return;
    started.current = true;
    void login(next);
  }, [failed, isAuthenticated, login, next]);

  if (failed) return <KeycloakLoginButton next={next} />;
  return <CircularProgress aria-label="Redirecting to login" />;
}

export default function LoginPage(): ReactElement {
  return (
    <Suspense fallback={null}>
      <StartLogin />
    </Suspense>
  );
}
