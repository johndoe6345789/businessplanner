'use client';

/**
 * Row card for a single pivot record.
 * @module components/molecules/PivotItem
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import IconButton from '@mui/material/IconButton';
import { useTranslations } from 'next-intl';
import type { Pivot } from '@/types/pivot';

/** Props for PivotItem. */
export interface PivotItemProps {
  /** Pivot record to display. */
  pivot: Pivot;
  /** Called when the edit button is clicked. */
  onEdit: (p: Pivot) => void;
  /** Called when the delete button is clicked. */
  onDelete: (id: string) => void;
}

/**
 * Timeline card for a single pivot record.
 *
 * @param props - Pivot data and action handlers.
 * @returns PivotItem UI.
 */
export const PivotItem: React.FC<
  PivotItemProps
> = ({ pivot: p, onEdit, onDelete }) => {
  const tc = useTranslations('common');

  return (
    <Box
      data-testid="pivot-item"
      sx={{ borderLeft: 4,
        borderColor: 'primary.main',
        pl: 2, mb: 3 }}>
      <Typography variant="caption"
        color="text.secondary">
        {p.pivoted_at}
      </Typography>
      <Typography variant="subtitle1"
        fontWeight={700}>
        {p.original_idea}
      </Typography>
      <Typography variant="body2"
        color="primary.main" sx={{ mb: 0.5 }}>
        → {p.new_direction}
      </Typography>
      {p.rationale && (
        <Typography variant="body2">
          {p.rationale}
        </Typography>
      )}
      <Box sx={{ mt: 1, display: 'flex',
        gap: 1 }}>
        <IconButton size="small"
          aria-label={tc('edit')}
          data-testid="pivot-edit-btn"
          onClick={() => onEdit(p)}>
          ✏️
        </IconButton>
        <IconButton size="small"
          aria-label={tc('delete')}
          data-testid="pivot-delete-btn"
          onClick={() => onDelete(p.id)}>
          🗑️
        </IconButton>
      </Box>
    </Box>
  );
};

export default PivotItem;
