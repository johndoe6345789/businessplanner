'use client';

/**
 * Persona board organism — card grid of customer personas.
 * @module components/organisms/PersonaBoard
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import { usePersonaBoard }
  from '@/hooks/usePersonaBoard';
import { PersonaCard }
  from '@/components/molecules/PersonaCard';
import { PersonaForm }
  from '@/components/molecules/PersonaForm';

/**
 * Card grid of customer personas with add/edit dialog.
 * @returns PersonaBoard UI.
 */
export const PersonaBoard: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const vm = usePersonaBoard();

  if (vm.isLoading) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center', mt: 4 }}>
        <CircularProgress
          aria-label={tc('loading')} />
      </Box>
    );
  }

  return (
    <Box data-testid="persona-board"
      aria-label={t('personas')}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained"
          onClick={vm.openAdd}
          aria-label={t('addPersona')}
          data-testid="persona-add-btn">
          {t('addPersona')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2,
        flexWrap: 'wrap' }}>
        {vm.data.map((p) => (
          <PersonaCard key={p.id}
            persona={p} onEdit={vm.openEdit} />
        ))}
      </Box>
      <Dialog open={vm.dialogOpen}
        onClose={() => vm.setDialogOpen(false)}
        aria-label={t('personas')}
        data-testid="persona-dialog"
        maxWidth="sm" fullWidth>
        <DialogTitle>
          {vm.editing
            ? vm.editing.name : t('addPersona')}
        </DialogTitle>
        <DialogContent
          style={{ overscrollBehavior: 'contain' }}>
          <PersonaForm initial={vm.editing}
            onDone={() => vm.setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PersonaBoard;
