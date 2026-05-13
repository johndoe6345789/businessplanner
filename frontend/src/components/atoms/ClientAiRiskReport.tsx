'use client';

/**
 * Client wrapper for AiRiskReport with SSR disabled.
 * Required because next/dynamic ssr:false is only valid
 * inside Client Components.
 * @module components/atoms/ClientAiRiskReport
 */
import dynamic from 'next/dynamic';

const AiRiskReport = dynamic(
  () => import(
    '@/components/organisms/AiRiskReport'
  ),
  { ssr: false },
);

/**
 * Renders AiRiskReport without SSR.
 * @returns AiRiskReport or null during SSR.
 */
export default function ClientAiRiskReport() {
  return <AiRiskReport />;
}
