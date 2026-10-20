'use client';

/**
 * Dialog for adding or editing a pivot record.
 * @module components/molecules/PivotDialog
 */
import React from 'react';
import Button from '@shared/m3/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent
  from '@mui/material/DialogContent';
import DialogActions
  from '@mui/material/DialogActions';
import { useTranslations } from 'next-intl';
import { PivotForm } from './PivotForm';
import type { PivotFormData } from '@/types/pivot';

/** Props for PivotDialog. */
export interface PivotDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Whether editing an existing record. */
  isEdit: boolean;
  /** Current form values. */
  form: PivotFormData;
  /** Called when form values change. */
  onFormChange: (v: PivotFormData) => void;
  /** Called when the user saves. */
  onSave: () => void;
  /** Called when the dialog is closed. */
  onClose: () => void;
}

/**
 * Modal dialog containing PivotForm.
 *
 * @param props - Dialog control props.
 * @returns PivotDialog UI.
 */
export const PivotDialog: React.FC<
  PivotDialogProps
> = ({ open, isEdit, form, onFormChange,
  onSave, onClose }) => {
  const t = useTranslations('pivot');
  const tc = useTranslations('common');

  return (
    <Dialog open={open} fullWidth maxWidth="sm"
      onClose={onClose}>
      <DialogTitle>
        {isEdit ? tc('edit') : t('add')}
      </DialogTitle>
      <DialogContent>
        <PivotForm value={form}
          onChange={onFormChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {tc('cancel')}
        </Button>
        <Button variant="contained"
          onClick={onSave}
          data-testid="pivot-save-btn">
          {tc('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PivotDialog;
