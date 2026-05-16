'use client';

import React from 'react';
import { Box, Typography, Chip } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type {
  PdcaCycle, PdcaPhaseKey,
} from '@/types/pdca';

/** Props for PdcaPhaseGrid. */
export interface PdcaPhaseGridProps {
  /** The PDCA cycle to display phases for. */
  readonly cycle: PdcaCycle;
}

const PHASES: PdcaPhaseKey[] = [
  'plan', 'do', 'check', 'act',
];

const phaseData = (
  cycle: PdcaCycle,
  phase: PdcaPhaseKey,
) => {
  const key = `${phase}_phase` as
    `${PdcaPhaseKey}_phase`;
  return cycle[key];
};

/** 4-cell grid showing PDCA phase completion state. */
const PdcaPhaseGrid: React.FC<PdcaPhaseGridProps> = (
  { cycle },
) => {
  const t = useTranslations('pdca');

  return (
    <Box sx={{ display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)', gap: 1 }}
      data-testid={`pdca-phase-grid-${cycle.id}`}>
      {PHASES.map((phase) => {
        const data = phaseData(cycle, phase);
        const isCurrent =
          cycle.current_phase === phase;
        return (
          <Box key={phase} sx={{ textAlign: 'center' }}>
            <Chip
              label={t(`phases.${phase}`)}
              size="small"
              color={
                data.completed ? 'success'
                : isCurrent ? 'primary'
                : 'default'
              }
              aria-label={`${t(`phases.${phase}`)}: ${
                data.completed
                  ? 'complete' : 'pending'}`}
              data-testid={
                `pdca-phase-${phase}-${cycle.id}`}
            />
            {data.notes && (
              <Typography variant="caption"
                sx={{ display: 'block', mt: 0.5 }}
                color="text.secondary">
                {data.notes.slice(0, 40)}
                {data.notes.length > 40 ? '…' : ''}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default PdcaPhaseGrid;
