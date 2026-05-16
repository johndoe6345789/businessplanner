'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@shared/m3';
import { useTranslations } from 'next-intl';
import { usePdca } from '@/hooks/usePdca';
import PdcaCycleCard
  from '@/components/molecules/PdcaCycleCard';

/** PDCA board — list of cycles with create dialog. */
const PdcaBoard: React.FC = () => {
  const t = useTranslations('pdca');
  const { cycles, isLoading, createCycle,
    updatePhase, deleteCycle } = usePdca();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const handleCreate = async () => {
    if (!title.trim()) return;
    await createCycle({ title });
    setTitle(''); setOpen(false);
  };

  return (
    <Box data-testid="pdca-board">
      <Box sx={{ display:'flex', justifyContent:'flex-end', mb:2 }}>
        <Button variant="contained"
          data-testid="pdca-add-btn"
          aria-label={t('addCycle')}
          onClick={() => setOpen(true)}>
          {t('addCycle')}
        </Button>
      </Box>

      {!isLoading && cycles.length === 0 && (
        <Typography color="text.secondary"
          data-testid="pdca-empty">
          {t('noCycles')}
        </Typography>
      )}

      <Grid container spacing={2}>
        {cycles.map((cycle) => (
          <Grid item xs={12} sm={6} md={4}
            key={cycle.id}>
            <PdcaCycleCard cycle={cycle}
              onAdvance={(input) => updatePhase(input)}
              onDelete={(id) => deleteCycle(id)} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open}
        onClose={() => setOpen(false)}
        data-testid="pdca-create-dialog">
        <DialogTitle>{t('addCycle')}</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth
            label="Title" value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="pdca-title-input"
            sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained"
            data-testid="pdca-create-confirm"
            onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PdcaBoard;
