'use client';

/**
 * @file WelcomeBannerLazy.tsx
 * @brief Client-side lazy wrapper for WelcomeBanner.
 *
 * next/dynamic with ssr:false must live in a Client Component.
 * This thin wrapper satisfies that requirement so the Server
 * Component layout can import it without restriction.
 */

import dynamic from 'next/dynamic';

/**
 * Lazily loaded WelcomeBanner with SSR disabled.
 * SSR is disabled because the banner reads localStorage,
 * which is unavailable during server rendering.
 */
const WelcomeBannerLazy = dynamic(
  () => import('@/components/molecules/WelcomeBanner'),
  { ssr: false },
);

export default WelcomeBannerLazy;
