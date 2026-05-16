'use client';

import React from 'react';
import {
  Box, Typography, LinearProgress, Chip, IconButton,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import type { KeyResult } from '@/types/okr';

/** Props for OkrKeyResultRow. */
export interface OkrKeyResultRowProps {
  readonly kr: KeyResult;
  readonly onDelete: (id: string) => void;
}

type ProgColor =
  'success' | 'warning' | 'error' | 'primary';

const STATUS_COLOR: Record<
  KeyResult['status'], ProgColor
> = {
  achieved: 'success',
  'on-track': 'primary',
  'at-risk': 'warning',
  behind: 'error',
};

/** Row showing a single OKR key result with progress. */
const OkrKeyResultRow: React.FC<
  OkrKeyResultRowProps
> = ({ kr, onDelete }) => {
  const t = useTranslations('okr');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center',
      gap: 1, py: 0.5 }}
      data-testid={`okr-kr-row-${kr.id}`}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap>
          {kr.title}
        </Typography>
        <LinearProgress variant="determinate"
          value={kr.progress}
          color={STATUS_COLOR[kr.status]}
          sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
          aria-label={
            `${kr.title}: ${kr.progress}%`} />
      </Box>
      <Chip size="small"
        label={t(`status.${kr.status}`)}
        color={STATUS_COLOR[kr.status]} />
      <Typography variant="caption"
        color="text.secondary" sx={{ whiteSpace:'nowrap' }}>
        {kr.current_value}/{kr.target_value}{kr.unit}
      </Typography>
      <IconButton size="small"
        aria-label={t('deleteKeyResult')}
        data-testid={`okr-kr-delete-${kr.id}`}
        onClick={() => onDelete(kr.id)}>
        <span aria-hidden style={{ fontSize: '0.875rem' }}>✕</span>
      </IconButton>
    </Box>
  );
};

export default OkrKeyResultRow;
