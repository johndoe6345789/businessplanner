'use client';

/**
 * PDF export button for the planner page.
 * @module components/molecules/PlanExportButton
 */
import React from 'react';
import Button from '@shared/m3/Button';
import CircularProgress
  from '@shared/m3/CircularProgress';
import { Download as DownloadIcon }
  from '@shared/icons/Download';
import { useTranslations } from 'next-intl';
import { usePlanExport } from '@/hooks/usePlanExport';

/** Props for PlanExportButton. */
export interface PlanExportButtonProps {
  /** data-testid override. */
  testId?: string;
}

/**
 * Button that exports the planner progress as a PDF.
 * Cycles through idle → generating → ready / error states.
 */
export const PlanExportButton: React.FC<
  PlanExportButtonProps
> = ({ testId = 'plan-export-button' }) => {
  const t = useTranslations('export');
  const { state, downloadUrl, exportPlan } =
    usePlanExport();

  if (state === 'ready' && downloadUrl) {
    return (
      <a
        href={downloadUrl}
        download
        data-testid={testId}
        aria-label={t('downloadPdf')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 16px',
          borderRadius: 4,
          background: 'var(--mui-palette-primary-main,#1976d2)',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        <DownloadIcon fontSize="small" />
        {t('downloadPdf')}
      </a>
    );
  }

  if (state === 'generating') {
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={
          <CircularProgress size={16} />
        }
        data-testid={testId}
        aria-label={t('generating')}
      >
        {t('generating')}
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      startIcon={<DownloadIcon />}
      onClick={exportPlan}
      data-testid={testId}
      aria-label={t('exportPlan')}
      color={state === 'error' ? 'error' : 'primary'}
    >
      {state === 'error'
        ? t('exportFailed')
        : t('exportPlan')}
    </Button>
  );
};

export default PlanExportButton;
