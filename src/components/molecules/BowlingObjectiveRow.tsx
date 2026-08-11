'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type {
  BowlingObjective, BowlingStatus,
  UpsertBowlingMonthInput,
} from '@/types/hoshinBowling';
import BowlingMonthCell
  from '@/components/atoms/BowlingMonthCell';

const MONTHS = Array.from({ length: 12 },
  (_, i) => i + 1);
const CYCLE: BowlingStatus[] = [
  'not-started', 'in-progress', 'achieved', 'missed',
];

/** Props for BowlingObjectiveRow. */
export interface BowlingObjectiveRowProps {
  readonly objective: BowlingObjective;
  readonly year: number;
  readonly onUpsertMonth: (
    objId: string,
    input: UpsertBowlingMonthInput,
  ) => void;
  readonly onDelete: (id: string) => void;
}

/** Single objective row in the bowling chart. */
const BowlingObjectiveRow: React.FC<
  BowlingObjectiveRowProps
> = ({ objective, year, onUpsertMonth, onDelete }) => {
  const t = useTranslations('bowling');
  const cycleStatus = (s?: BowlingStatus) =>
    CYCLE[(CYCLE.indexOf(s ?? 'not-started') + 1)
      % CYCLE.length];

  return (
    <Box sx={{ display:'flex', gap:1,
      alignItems:'center', mb:0.5 }}
      data-testid={`bowling-row-${objective.id}`}>
      <Box sx={{ width:180, display:'flex',
        alignItems:'center', gap:0.5 }}>
        <Typography variant="body2" noWrap>
          {objective.title}
        </Typography>
        <IconButton size="small"
          aria-label={t('deleteObjective')}
          data-testid={`bowling-delete-${objective.id}`}
          onClick={() => onDelete(objective.id)}>
          <span aria-hidden style={{ fontSize: '0.875rem' }}>✕</span>
        </IconButton>
      </Box>
      {MONTHS.map((m) => {
        const cell = objective.months
          .find((mo) => mo.month === m);
        return (
          <BowlingMonthCell key={m} month={m}
            status={cell?.status}
            actual={cell?.actual}
            target={cell?.target}
            onClick={() => onUpsertMonth(objective.id, {
              month: m, year,
              status: cycleStatus(cell?.status),
              actual: cell?.actual ?? 0,
              target: cell?.target ?? 0,
            })} />
        );
      })}
    </Box>
  );
};

export default BowlingObjectiveRow;
