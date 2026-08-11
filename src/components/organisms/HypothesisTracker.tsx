'use client';

/**
 * Financial hypothesis tracker organism.
 * @module components/organisms/HypothesisTracker
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import Chip from '@shared/m3/Chip';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import {
  useListHypothesesQuery,
  useUpdateHypothesisMutation,
  useDeleteHypothesisMutation,
} from '@/store/api/financialsHypothesisApi';
import { HypothesisAddForm }
  from '@/components/molecules/HypothesisAddForm';
import type { FinancialHypothesis } from '@/types/financials';

type Status = FinancialHypothesis['status'];

const STATUS_COLORS: Record<Status,
  'default' | 'success' | 'error'> = {
  untested: 'default',
  validated: 'success',
  invalidated: 'error',
};
const NEXT_STATUS: Record<Status, Status> = {
  untested: 'validated',
  validated: 'invalidated',
  invalidated: 'untested',
};

/**
 * Lists, updates, and deletes financial hypotheses.
 * @returns HypothesisTracker UI.
 */
export const HypothesisTracker: React.FC = () => {
  const t = useTranslations('financials');
  const { data, isLoading } = useListHypothesesQuery();
  const [update] = useUpdateHypothesisMutation();
  const [remove] = useDeleteHypothesisMutation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box data-testid="hypothesis-tracker"
      aria-label={t('hypotheses.title')}>
      <HypothesisAddForm />
      {(data ?? []).map((h) => (
        <Box key={h.id}
          data-testid={`hyp-row-${h.id}`}
          sx={{ display: 'flex',
            alignItems: 'flex-start',
            gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ flex: 2, minWidth: 180 }}>
            {h.assumption}
          </Typography>
          <Chip label={h.status}
            color={STATUS_COLORS[h.status]}
            onClick={() =>
              void update({
                id: h.id,
                status: NEXT_STATUS[h.status],
              })}
            aria-label={
              `${t('hypotheses.status')}: ${h.status}`}
            data-testid={`hyp-status-${h.id}`}
            size="small" />
          <Button size="small" color="error"
            onClick={() => void remove(h.id)}
            aria-label={`Delete ${h.assumption}`}
            data-testid={`hyp-delete-${h.id}`}>
            ✕
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default HypothesisTracker;
