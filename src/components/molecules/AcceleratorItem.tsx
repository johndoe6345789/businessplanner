'use client';

/**
 * Row card for a single accelerator record.
 * @module components/molecules/AcceleratorItem
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { useTranslations } from 'next-intl';
import type { Accelerator } from '@/types/accelerators';

type ChipColor =
  'default' | 'success' | 'error' |
  'warning' | 'info';

const STATUS_COLOR: Record<string, ChipColor> = {
  accepted: 'success',
  rejected: 'error',
  interviewing: 'warning',
  applied: 'info',
  applying: 'info',
  researching: 'default',
  passed: 'default',
};

/** Props for AcceleratorItem. */
export interface AcceleratorItemProps {
  /** Accelerator record to display. */
  accelerator: Accelerator;
  /** Called when the edit button is clicked. */
  onEdit: (a: Accelerator) => void;
  /** Called when the delete button is clicked. */
  onDelete: (id: string) => void;
}

/**
 * Card row for a single accelerator programme.
 *
 * @param props - Accelerator data and action handlers.
 * @returns AcceleratorItem UI.
 */
export const AcceleratorItem: React.FC<
  AcceleratorItemProps
> = ({ accelerator: a, onEdit, onDelete }) => {
  const t = useTranslations('accelerators');
  const tc = useTranslations('common');

  return (
    <Box data-testid="accel-item"
      sx={{ p: 2, mb: 2, border: 1,
        borderColor: 'divider',
        borderRadius: 2 }}>
      <Box sx={{ display: 'flex', gap: 1,
        flexWrap: 'wrap', mb: 0.5,
        alignItems: 'center' }}>
        <Typography variant="subtitle1"
          fontWeight={700}>
          {a.name}
        </Typography>
        <Chip size="small" label={a.status}
          color={
            STATUS_COLOR[a.status] ?? 'default'
          } />
        <Chip size="small"
          label={a.programme_type}
          variant="outlined" />
      </Box>
      {a.deadline && (
        <Typography variant="body2"
          color="text.secondary">
          {t('deadline')}: {a.deadline}
        </Typography>
      )}
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <IconButton size="small"
          aria-label={tc('edit')}
          data-testid="accel-edit-btn"
          onClick={() => onEdit(a)}>
          ✏️
        </IconButton>
        <IconButton size="small"
          aria-label={tc('delete')}
          data-testid="accel-delete-btn"
          onClick={() => onDelete(a.id)}>
          🗑️
        </IconButton>
      </Box>
    </Box>
  );
};

export default AcceleratorItem;
