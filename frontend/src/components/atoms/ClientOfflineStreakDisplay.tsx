'use client';

/**
 * Client wrapper for OfflineStreakDisplay with SSR
 * disabled (reads IndexedDB / offline cache APIs).
 * @module components/atoms/ClientOfflineStreakDisplay
 */
import dynamic from 'next/dynamic';

const OfflineStreakDisplay = dynamic(
  () => import(
    '@/components/molecules/OfflineStreakDisplay'
  ),
  { ssr: false },
);

/**
 * Renders OfflineStreakDisplay without SSR.
 * @returns OfflineStreakDisplay or null during SSR.
 */
export default function ClientOfflineStreakDisplay() {
  return <OfflineStreakDisplay />;
}
