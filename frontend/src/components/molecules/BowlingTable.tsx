'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import type {
  BowlingObjective, UpsertBowlingMonthInput,
} from '@/types/hoshinBowling';
import BowlingObjectiveRow
  from '@/components/molecules/BowlingObjectiveRow';

const MONTHS = Array.from({ length: 12 },
  (_, i) => i + 1);

/** Props for BowlingTable. */
export interface BowlingTableProps {
  readonly objectives: BowlingObjective[];
  readonly year: number;
  readonly onUpsertMonth: (
    objId: string,
    input: UpsertBowlingMonthInput,
  ) => void;
  readonly onDeleteObjective: (id: string) => void;
}

/** Grid of objectives × months forming the bowling chart. */
const BowlingTable: React.FC<BowlingTableProps> = (
  { objectives, year, onUpsertMonth,
    onDeleteObjective },
) => {
  const t = useTranslations('bowling');
  return (
    <Box data-testid="bowling-table"
      sx={{ overflowX: 'auto' }}>
      <Box sx={{ display:'flex', gap:1,
        alignItems:'center', mb:1 }}>
        <Box sx={{ width: 180 }} />
        {MONTHS.map((m) => (
          <Box key={m}
            sx={{ width:32, textAlign:'center' }}>
            <Typography variant="caption">
              {t(`months.${m}`)}
            </Typography>
          </Box>
        ))}
      </Box>
      {objectives.map((obj) => (
        <BowlingObjectiveRow key={obj.id}
          objective={obj} year={year}
          onUpsertMonth={onUpsertMonth}
          onDelete={onDeleteObjective} />
      ))}
      {objectives.length === 0 && (
        <Typography color="text.secondary"
          data-testid="bowling-empty">
          {t('noObjectives')}
        </Typography>
      )}
    </Box>
  );
};

export default BowlingTable;
