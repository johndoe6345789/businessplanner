'use client';

/**
 * Add/edit dialog for a decision log entry.
 * @module components/organisms/DecisionDialog
 */
import React from 'react';
import Button from '@shared/m3/Button';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import DialogActions from
  '@shared/m3/DialogActions';
import { useTranslations } from 'next-intl';
import { DecisionForm }
  from '@/components/molecules/DecisionForm';
import type { DecisionFormData } from '@/types/decisions';

/** Props for DecisionDialog. */
export interface DecisionDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** True when editing an existing entry. */
  isEdit: boolean;
  /** Current form field values. */
  form: DecisionFormData;
  /** Called when form fields change. */
  onFormChange: (v: DecisionFormData) => void;
  /** Called on save confirmation. */
  onSave: () => void;
  /** Called on cancel / close. */
  onClose: () => void;
}

/**
 * Modal dialog wrapping DecisionForm.
 * Used for both create and edit flows.
 *
 * @param props - Dialog control props.
 * @returns DecisionDialog UI.
 */
export const DecisionDialog: React.FC<
  DecisionDialogProps
> = ({
  open, isEdit, form,
  onFormChange, onSave, onClose,
}) => {
  const t = useTranslations('decisions');
  const tc = useTranslations('common');

  return (
    <Dialog open={open} onClose={onClose}
      aria-label={isEdit ? tc('edit') : t('add')}
      data-testid="decision-dialog"
      maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? tc('edit') : t('add')}
      </DialogTitle>
      <DialogContent
        sx={{ overscrollBehavior: 'contain' }}>
        <DecisionForm
          value={form} onChange={onFormChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}
          aria-label={tc('cancel')}>
          {tc('cancel')}
        </Button>
        <Button variant="contained"
          onClick={onSave}
          aria-label={tc('save')}
          data-testid="decision-save-btn">
          {tc('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DecisionDialog;
