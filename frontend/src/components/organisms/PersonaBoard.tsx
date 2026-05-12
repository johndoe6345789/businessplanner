'use client';

/**
 * Persona board organism — card grid of customer personas.
 * @module components/organisms/PersonaBoard
 */
import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Card from '@shared/m3/Card';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import CircularProgress from
  '@mui/material/CircularProgress';
import { useTranslations } from 'next-intl';
import {
  useListPersonasQuery,
} from '@/store/api/marketResearchPersonaApi';
import { PersonaForm }
  from '@/components/molecules/PersonaForm';
import type { Persona } from '@/types/marketResearch';

const PREVIEW_LIMIT = 3;

/**
 * Card grid of customer personas with add/edit dialog.
 * @returns PersonaBoard UI.
 */
export const PersonaBoard: React.FC = () => {
  const t = useTranslations('marketResearch');
  const tc = useTranslations('common');
  const { data = [], isLoading } = useListPersonasQuery();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] =
    useState<Persona | undefined>(undefined);

  const openAdd = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (p: Persona) => {
    setEditing(p);
    setDialogOpen(true);
  };

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
    <Box data-testid="persona-board"
      aria-label={t('personas')}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained"
          onClick={openAdd}
          aria-label={t('addPersona')}
          data-testid="persona-add-btn">
          {t('addPersona')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2,
        flexWrap: 'wrap' }}>
        {data.map((p) => (
          <Card key={p.id}
            data-testid={`persona-card-${p.id}`}
            onClick={() => openEdit(p)}
            sx={{ width: 260, cursor: 'pointer' }}
            role="button"
            aria-label={p.name}
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === 'Enter' && openEdit(p)}>
            <CardContent>
              <Typography variant="h6"
                sx={{ fontWeight: 700 }}>
                {p.name}
              </Typography>
              <Typography variant="body2"
                color="text.secondary" sx={{ mb: 1 }}>
                {p.role}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5,
                flexWrap: 'wrap', mb: 1 }}>
                {p.painPoints
                  .slice(0, PREVIEW_LIMIT)
                  .map((pp, i) => (
                    <Chip key={i} label={pp}
                      size="small" color="error"
                      variant="outlined" />
                  ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5,
                flexWrap: 'wrap' }}>
                {p.goals
                  .slice(0, PREVIEW_LIMIT)
                  .map((g, i) => (
                    <Chip key={i} label={g}
                      size="small" color="success"
                      variant="outlined" />
                  ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Dialog open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-label={t('personas')}
        data-testid="persona-dialog"
        maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? editing.name : t('addPersona')}
        </DialogTitle>
        <DialogContent
          sx={{ overscrollBehavior: 'contain' }}>
          <PersonaForm initial={editing}
            onDone={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PersonaBoard;
