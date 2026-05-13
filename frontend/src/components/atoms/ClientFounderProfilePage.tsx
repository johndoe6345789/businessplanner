'use client';

/**
 * Client wrapper for FounderProfilePageClient with SSR
 * disabled. Required because next/dynamic ssr:false is
 * only valid inside Client Components.
 * @module components/atoms/ClientFounderProfilePage
 */
import dynamic from 'next/dynamic';

const FounderProfilePageClient = dynamic(
  () => import(
    '@/components/organisms/FounderProfilePageClient'
  ),
  { ssr: false },
);

/** Props for ClientFounderProfilePage. */
interface ClientFounderProfilePageProps {
  /** Username slug from the route params. */
  readonly username: string;
}

/**
 * Renders FounderProfilePageClient without SSR.
 * @param props - Username prop for the profile.
 * @returns FounderProfilePageClient or null on server.
 */
export default function ClientFounderProfilePage({
  username,
}: ClientFounderProfilePageProps) {
  return <FounderProfilePageClient username={username} />;
}
