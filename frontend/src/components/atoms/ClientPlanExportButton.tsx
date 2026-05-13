'use client';

/**
 * Client wrapper for PlanExportButton with SSR disabled.
 * Required because next/dynamic ssr:false is only valid
 * inside Client Components.
 * @module components/atoms/ClientPlanExportButton
 */
import dynamic from 'next/dynamic';

const PlanExportButton = dynamic(
  () => import(
    '@/components/molecules/PlanExportButton'
  ),
  { ssr: false },
);

/**
 * Renders PlanExportButton without SSR.
 * @returns PlanExportButton or null during SSR.
 */
export default function ClientPlanExportButton() {
  return <PlanExportButton />;
}
