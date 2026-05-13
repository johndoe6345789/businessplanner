'use client';

/**
 * Client wrapper for AiDocumentDrafter with SSR
 * disabled. Required because next/dynamic ssr:false
 * is only valid inside Client Components.
 * @module components/atoms/ClientAiDocumentDrafter
 */
import dynamic from 'next/dynamic';

const AiDocumentDrafter = dynamic(
  () => import(
    '@/components/organisms/AiDocumentDrafter'
  ),
  { ssr: false },
);

/**
 * Renders AiDocumentDrafter without SSR.
 * @returns AiDocumentDrafter or null during SSR.
 */
export default function ClientAiDocumentDrafter() {
  return <AiDocumentDrafter />;
}
