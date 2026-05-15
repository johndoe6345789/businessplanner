'use client';

/**
 * Accelerator tracker organism — sortable list + CRUD.
 * @module components/organisms/AcceleratorTracker
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import CircularProgress
  from '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { AcceleratorDialog }
  from '@/components/molecules/AcceleratorDialog';
import { AcceleratorItem }
  from '@/components/molecules/AcceleratorItem';
import { useAcceleratorTracker }
  from '@/hooks/useAcceleratorTracker';

/**
 * Sortable list of accelerator programmes with dialog.
 * @returns AcceleratorTracker UI.
 */
export const AcceleratorTracker: React.FC = () => {
  const t = useTranslations('accelerators');
  const tc = useTranslations('common');
  const {
    data, isLoading, isError, saveError,
    open, setOpen,
    editing, form, setForm,
    openAdd, openEdit,
    handleSave, handleDelete,
  } = useAcceleratorTracker();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error"
        data-testid="accel-error">
        {tc('error')}
      </Typography>
    );
  }

  return (
    <Box data-testid="accelerator-tracker"
      aria-label={t('title')}>
      {saveError && (
        <Typography color="error" sx={{ mb: 2 }}
          data-testid="accel-save-error">
          {saveError}
        </Typography>
      )}
      <Box sx={{ display: 'flex',
        justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained"
          onClick={openAdd}
          aria-label={t('add')}
          data-testid="accel-add-btn">
          {t('add')}
        </Button>
      </Box>
      {data.length === 0 && (
        <Typography color="text.secondary"
          data-testid="accel-empty">
          {t('noEntries')}
        </Typography>
      )}
      {data.map((a) => (
        <AcceleratorItem key={a.id}
          accelerator={a}
          onEdit={openEdit}
          onDelete={handleDelete} />
      ))}
      <AcceleratorDialog open={open}
        isEdit={!!editing} form={form}
        onFormChange={setForm}
        onSave={handleSave}
        onClose={() => setOpen(false)} />
    </Box>
  );
};

export default AcceleratorTracker;
