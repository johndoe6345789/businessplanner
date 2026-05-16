'use client';

import React from 'react';
import { Chip } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { KpiStatus } from '@/types/kpi';

/** Props for KpiStatusChip. */
export interface KpiStatusChipProps {
  /** Traffic-light status to display. */
  readonly status: KpiStatus;
}

type ChipColor = 'success' | 'warning' | 'error';

const STATUS_COLOR: Record<KpiStatus, ChipColor> = {
  'on-track': 'success',
  'at-risk':  'warning',
  'off-track': 'error',
};

/**
 * Traffic-light chip for a KPI metric status.
 *
 * @param props - KpiStatusChipProps.
 * @returns Coloured MUI Chip.
 */
const KpiStatusChip: React.FC<KpiStatusChipProps> = (
  { status },
) => {
  const t = useTranslations('kpi.status');
  const label = t(status);
  return (
    <Chip
      label={label}
      color={STATUS_COLOR[status]}
      size="small"
      aria-label={label}
      data-testid={`kpi-status-chip-${status}`}
      sx={{ fontWeight: 700 }}
    />
  );
};

export default KpiStatusChip;
