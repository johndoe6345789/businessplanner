'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Select,
  MenuItem, FormControl, InputLabel, TextField,
} from '@shared/m3';
import type { SelectChangeEvent } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useOkr } from '@/hooks/useOkr';
import OkrObjectiveCard
  from '@/components/molecules/OkrObjectiveCard';
import OkrCreateDialog
  from '@/components/molecules/OkrCreateDialog';

const QUARTERS = [1, 2, 3, 4];
/** OKR board — period selector and objective cards. */
const OkrBoard: React.FC = () => {
  const t = useTranslations('okr');
  const { objectives, isLoading, quarter, year,
    setQuarter, setYear, createObjective,
    deleteObjective, addKeyResult, deleteKeyResult } =
    useOkr();
  const [open, setOpen] = useState(false);
  const handleCreate = async (title: string) => {
    await createObjective({ title, quarter, year });
    setOpen(false);
  };

  return (
    <Box data-testid="okr-board">
      <Box sx={{ display:'flex',gap:1,alignItems:'center',mb:2,flexWrap:'wrap' }}>
        <FormControl size="small" sx={{ minWidth:90 }}>
          <InputLabel>Quarter</InputLabel>
          <Select value={String(quarter)} label="Quarter"
            onChange={(e: SelectChangeEvent<string>) =>
              setQuarter(Number(e.target.value))}>
            {QUARTERS.map((q) => (
              <MenuItem key={q} value={String(q)}>Q{q}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField size="small" label="Year"
          type="number" value={String(year)}
          onChange={(e) => setYear(Number(e.target.value))}
          data-testid="okr-year-input" sx={{ width:90 }} />
        <Button variant="contained"
          data-testid="okr-add-btn"
          aria-label={t('addObjective')}
          onClick={() => setOpen(true)}>
          {t('addObjective')}
        </Button>
      </Box>

      {!isLoading && objectives.length === 0 && (
        <Typography color="text.secondary"
          data-testid="okr-empty">
          {t('noObjectives')}
        </Typography>
      )}

      <Grid container spacing={2}>
        {objectives.map((obj) => (
          <Grid item xs={12} md={6} key={obj.id}>
            <OkrObjectiveCard objective={obj}
              onAddKr={(i) => addKeyResult(i)}
              onDeleteObjective={deleteObjective}
              onDeleteKr={deleteKeyResult} />
          </Grid>
        ))}
      </Grid>

      <OkrCreateDialog open={open} quarter={quarter}
        year={year} onClose={() => setOpen(false)}
        onCreate={handleCreate} />
    </Box>
  );
};

export default OkrBoard;
