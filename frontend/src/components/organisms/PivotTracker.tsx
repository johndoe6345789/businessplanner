'use client';

/**
 * Pivot tracker organism — timeline list + CRUD.
 * @module components/organisms/PivotTracker
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import CircularProgress
  from '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { PivotDialog }
  from '@/components/molecules/PivotDialog';
import { PivotItem }
  from '@/components/molecules/PivotItem';
import { usePivotTracker }
  from '@/hooks/usePivotTracker';

/**
 * Timeline list of pivots with add/edit/delete.
 * @returns PivotTracker UI.
 */
export const PivotTracker: React.FC = () => {
  const t = useTranslations('pivot');
  const tc = useTranslations('common');
  const {
    data, isLoading,
    open, setOpen,
    editing, form, setForm,
    openAdd, openEdit,
    handleSave, handleDelete,
  } = usePivotTracker();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="pivot-tracker"
      aria-label={t('title')}>
      <Box sx={{ display: 'flex',
        justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained"
          onClick={openAdd}
          aria-label={t('add')}
          data-testid="pivot-add-btn">
          {t('add')}
        </Button>
      </Box>
      {data.length === 0 && (
        <Typography color="text.secondary"
          data-testid="pivot-empty">
          {t('noEntries')}
        </Typography>
      )}
      {data.map((p) => (
        <PivotItem key={p.id} pivot={p}
          onEdit={openEdit}
          onDelete={handleDelete} />
      ))}
      <PivotDialog open={open}
        isEdit={!!editing} form={form}
        onFormChange={setForm}
        onSave={handleSave}
        onClose={() => setOpen(false)} />
    </Box>
  );
};

export default PivotTracker;
