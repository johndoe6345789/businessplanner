'use client';

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button,
} from '@shared/m3';
import { useTranslations } from 'next-intl';

/** Props for OkrCreateDialog. */
export interface OkrCreateDialogProps {
  readonly open: boolean;
  readonly quarter: number;
  readonly year: number;
  readonly onClose: () => void;
  readonly onCreate: (title: string) => void;
}

/**
 * Dialog for creating a new OKR objective.
 *
 * @param props - OkrCreateDialogProps.
 * @returns Dialog element.
 */
const OkrCreateDialog: React.FC<
  OkrCreateDialogProps
> = ({ open, onClose, onCreate }) => {
  const t = useTranslations('okr');
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title);
    setTitle('');
  };

  return (
    <Dialog open={open} onClose={onClose}
      data-testid="okr-create-dialog">
      <DialogTitle>{t('addObjective')}</DialogTitle>
      <DialogContent>
        <TextField autoFocus fullWidth label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-testid="okr-title-input"
          sx={{ mt: 1 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained"
          data-testid="okr-create-confirm"
          onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OkrCreateDialog;
