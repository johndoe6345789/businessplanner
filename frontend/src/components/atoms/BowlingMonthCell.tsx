'use client';

import React from 'react';
import { Box, Tooltip } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { BowlingStatus } from '@/types/hoshinBowling';

/** Props for BowlingMonthCell. */
export interface BowlingMonthCellProps {
  /** Calendar month (1–12), or undefined if empty. */
  readonly month: number;
  /** Status to colour the cell, or undefined. */
  readonly status?: BowlingStatus;
  /** Actual value for the tooltip. */
  readonly actual?: number;
  /** Target value for the tooltip. */
  readonly target?: number;
  /** Called when user clicks the cell. */
  readonly onClick?: () => void;
}

const STATUS_BG: Record<BowlingStatus, string> = {
  'not-started': 'grey.200',
  'in-progress': 'primary.light',
  'achieved': 'success.light',
  'missed': 'error.light',
};

/** Single coloured cell in the bowling chart grid. */
const BowlingMonthCell: React.FC<
  BowlingMonthCellProps
> = ({ month, status, actual, target, onClick }) => {
  const t = useTranslations('bowling');
  const statusLabel = status
    ? t(`status.${status}`) : t('status.not-started');
  const ariaLabel = t('cellAriaLabel',
    { month, status: statusLabel });

  return (
    <Tooltip title={
      status
        ? `${actual ?? 0} / ${target ?? 0}`
        : statusLabel
    }>
      <Box
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ')
            onClick?.();
        }}
        aria-label={ariaLabel}
        data-testid={`bowling-cell-${month}`}
        sx={{
          width: 32, height: 32, borderRadius: 1,
          bgcolor: status
            ? STATUS_BG[status] : 'grey.100',
          cursor: onClick ? 'pointer' : 'default',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'opacity 0.15s',
          '&:hover': { opacity: 0.8 },
        }}
      />
    </Tooltip>
  );
};

export default BowlingMonthCell;
