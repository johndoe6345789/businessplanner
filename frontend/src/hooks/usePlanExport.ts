'use client';

/**
 * Hook for exporting the planner as a PDF.
 * @module hooks/usePlanExport
 */
import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  useRenderPdfMutation,
  useGetPdfStatusQuery,
} from '@/store/api/pdfApi';
import { buildPlanHtml } from './planExportHtml';

/** State of the export job. */
export type ExportState =
  | 'idle' | 'generating' | 'ready' | 'error';

/** Return type for usePlanExport. */
export interface UsePlanExportReturn {
  /** Current export lifecycle state. */
  state: ExportState;
  /** Signed download URL once export is ready. */
  downloadUrl: string | undefined;
  /** Kick off a new PDF export. */
  exportPlan: () => void;
}

/**
 * Manages PDF export lifecycle including polling.
 * @returns Export state, download URL, and trigger fn.
 */
export function usePlanExport(): UsePlanExportReturn {
  const completedSteps = useAppSelector(
    (s) => s.planner.completedSteps,
  );
  const startupName = useAppSelector(
    (s) => s.startupType.startupName,
  );
  const [exportState, setExportState] =
    useState<ExportState>('idle');
  const [jobId, setJobId] = useState<
    string | undefined
  >(undefined);
  const [downloadUrl, setDownloadUrl] =
    useState<string | undefined>(undefined);
  const pollingRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [renderPdf] = useRenderPdfMutation();
  const { data: statusData, refetch } =
    useGetPdfStatusQuery(jobId ?? '', {
      skip: !jobId,
    });

  useEffect(() => {
    if (!jobId) return;
    if (statusData?.status === 'done') {
      setDownloadUrl(statusData.url);
      setExportState('ready');
      setJobId(undefined);
    } else if (statusData?.status === 'failed') {
      setExportState('error');
      setJobId(undefined);
    } else if (exportState === 'generating') {
      pollingRef.current = setTimeout(
        () => void refetch(), 3000,
      );
    }
    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, [jobId, statusData, exportState, refetch]);

  const exportPlan = () => {
    const html = buildPlanHtml(
      startupName, completedSteps,
    );
    setExportState('generating');
    setDownloadUrl(undefined);
    renderPdf({ template: 'plan', html })
      .unwrap()
      .then((res) => { setJobId(res.id); })
      .catch(() => { setExportState('error'); });
  };

  return { state: exportState, downloadUrl, exportPlan };
}
