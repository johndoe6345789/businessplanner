'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useBowlingChart }
  from '@/hooks/useBowlingChart';
import BowlingTable
  from '@/components/molecules/BowlingTable';

/**
 * Bowling chart tab — year selector, add-objective
 * form, and the bowling grid table.
 */
const BowlingChartTab: React.FC = () => {
  const t = useTranslations('bowling');
  const {
    objectives, isLoading, year, setYear,
    createObjective, deleteObjective, upsertMonth,
  } = useBowlingChart();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await createObjective({ title: newTitle });
    setNewTitle('');
  };

  return (
    <Box data-testid="bowling-chart-tab">
      <Box sx={{ display:'flex', gap:1,
        alignItems:'center', mb:2, flexWrap:'wrap' }}>
        <TextField size="small" label="Year"
          type="number" value={String(year)}
          onChange={(e) => setYear(Number(e.target.value))}
          data-testid="bowling-year-input"
          sx={{ width: 90 }} />
        <TextField size="small"
          label={t('objectivePlaceholder')}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          data-testid="bowling-title-input" />
        <Button variant="contained"
          disabled={isLoading}
          data-testid="bowling-add-btn"
          aria-label={t('addObjective')}
          onClick={handleAdd}>
          {t('addObjective')}
        </Button>
      </Box>

      {!isLoading && objectives.length === 0 && (
        <Typography color="text.secondary"
          data-testid="bowling-empty-prompt">
          {t('noObjectives')}
        </Typography>
      )}

      <BowlingTable
        objectives={objectives}
        year={year}
        onUpsertMonth={(objId, input) =>
          upsertMonth({ objId, ...input })}
        onDeleteObjective={(id) =>
          deleteObjective(id)} />
    </Box>
  );
};

export default BowlingChartTab;
