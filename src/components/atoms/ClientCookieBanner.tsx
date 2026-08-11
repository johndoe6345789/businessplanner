'use client';

/**
 * Client-side wrapper that lazy-loads CookieConsentBanner
 * with SSR disabled (banner reads localStorage on mount).
 * Must be a Client Component so next/dynamic ssr:false is
 * allowed.
 * @module components/atoms/ClientCookieBanner
 */
import dynamic from 'next/dynamic';

const CookieConsentBanner = dynamic(
  () => import(
    '@/components/organisms/CookieConsentBanner'
  ),
  { ssr: false },
);

/**
 * Renders the cookie consent banner with SSR disabled.
 * @returns CookieConsentBanner or null during SSR.
 */
export default function ClientCookieBanner() {
  return <CookieConsentBanner />;
}
