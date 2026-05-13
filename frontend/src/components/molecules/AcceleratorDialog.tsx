'use client';

/**
 * Dialog for adding or editing an accelerator record.
 * @module components/molecules/AcceleratorDialog
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
import { AcceleratorForm }
  from './AcceleratorForm';
import type {
  AcceleratorFormData,
} from '@/types/accelerators';

/** Props for AcceleratorDialog. */
export interface AcceleratorDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Whether editing an existing record. */
  isEdit: boolean;
  /** Current form values. */
  form: AcceleratorFormData;
  /** Called when form values change. */
  onFormChange: (v: AcceleratorFormData) => void;
  /** Called when the user saves. */
  onSave: () => void;
  /** Called when the dialog is closed. */
  onClose: () => void;
}

/**
 * Modal dialog containing AcceleratorForm.
 *
 * @param props - Dialog control props.
 * @returns AcceleratorDialog UI.
 */
export const AcceleratorDialog: React.FC<
  AcceleratorDialogProps
> = ({ open, isEdit, form, onFormChange,
  onSave, onClose }) => {
  const t = useTranslations('accelerators');
  const tc = useTranslations('common');

  return (
    <Dialog open={open} fullWidth maxWidth="sm"
      onClose={onClose}>
      <DialogTitle>
        {isEdit ? tc('edit') : t('add')}
      </DialogTitle>
      <DialogContent>
        <AcceleratorForm value={form}
          onChange={onFormChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {tc('cancel')}
        </Button>
        <Button variant="contained"
          onClick={onSave}
          data-testid="accel-save-btn">
          {tc('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceleratorDialog;
