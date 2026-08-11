'use client';

/**
 * Decision log organism — searchable CRUD list.
 * @module components/organisms/DecisionLog
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { DecisionCard }
  from '@/components/molecules/DecisionCard';
import { DecisionDialog }
  from './DecisionDialog';
import { useDecisionLog } from '@/hooks/useDecisionLog';

/**
 * Searchable decision log with add/edit/delete.
 * @returns DecisionLog UI.
 */
export const DecisionLog: React.FC = () => {
  const t = useTranslations('decisions');
  const tc = useTranslations('common');
  const {
    search, setSearch,
    dialogOpen, setDialogOpen,
    editing, form, setForm,
    data, isLoading,
    openAdd, openEdit,
    handleSave, handleDelete,
  } = useDecisionLog();

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
    <Box data-testid="decision-log"
      aria-label={t('title')}>
      <Box sx={{ display: 'flex',
        gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label={t('search')} value={search}
          onChange={(e) =>
            setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 200 }}
          inputProps={{
            'data-testid': 'dec-search',
          }}
          aria-label={t('search')}
        />
        <Button variant="contained"
          onClick={openAdd}
          aria-label={t('add')}
          data-testid="decision-add-btn">
          {t('add')}
        </Button>
      </Box>
      {data.length === 0 && (
        <Typography color="text.secondary"
          data-testid="dec-empty">
          {t('noDecisions')}
        </Typography>
      )}
      {data.map((d) => (
        <DecisionCard key={d.id} decision={d}
          onEdit={openEdit}
          onDelete={handleDelete} />
      ))}
      <DecisionDialog
        open={dialogOpen}
        isEdit={!!editing}
        form={form}
        onFormChange={setForm}
        onSave={handleSave}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  );
};

export default DecisionLog;
