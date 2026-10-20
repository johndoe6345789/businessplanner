'use client';

import React from 'react';
import {
  Card, CardContent, CardActions,
  Typography, Chip, Button, IconButton,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import type {
  PdcaCycle, PdcaPhaseKey, UpdatePdcaPhaseInput,
} from '@/types/pdca';
import PdcaPhaseGrid
  from '@/components/molecules/PdcaPhaseGrid';

/** Props for PdcaCycleCard. */
export interface PdcaCycleCardProps {
  readonly cycle: PdcaCycle;
  readonly onAdvance: (
    input: { id: string } & UpdatePdcaPhaseInput,
  ) => void;
  readonly onDelete: (id: string) => void;
}

const NEXT_PHASE: Record<PdcaPhaseKey, PdcaPhaseKey | null> = {
  plan: 'do', do: 'check', check: 'act', act: null,
};

/** Card showing a PDCA cycle with phase grid. */
const PdcaCycleCard: React.FC<PdcaCycleCardProps> = (
  { cycle, onAdvance, onDelete },
) => {
  const t = useTranslations('pdca');
  const next = NEXT_PHASE[cycle.current_phase];

  const advance = () => {
    onAdvance({
      id: cycle.id,
      phase: cycle.current_phase,
      notes: '',
      completed: true,
    });
  };

  return (
    <Card data-testid={`pdca-cycle-card-${cycle.id}`}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          {cycle.title}
        </Typography>
        <Chip size="small"
          label={t(`status.${cycle.status}`)}
          color={
            cycle.status === 'completed'
              ? 'success' : 'primary'}
          sx={{ my: 1 }} />
        <PdcaPhaseGrid cycle={cycle} />
      </CardContent>
      <CardActions>
        {next && cycle.status === 'in-progress' && (
          <Button size="small" variant="contained"
            data-testid={`pdca-advance-${cycle.id}`}
            aria-label={t('markComplete')}
            onClick={advance}>
            {t('markComplete')}
          </Button>
        )}
        <IconButton size="small"
          aria-label={t('deleteCycle')}
          data-testid={`pdca-delete-${cycle.id}`}
          onClick={() => onDelete(cycle.id)}>
          <span aria-hidden style={{ fontSize: '0.875rem' }}>✕</span>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PdcaCycleCard;
