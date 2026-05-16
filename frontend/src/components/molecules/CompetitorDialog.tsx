'use client';

/**
 * Dialog wrapper for the CompetitorForm molecule.
 * @module components/molecules/CompetitorDialog
 */
import React from 'react';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import { useTranslations } from 'next-intl';
import { CompetitorForm }
  from '@/components/molecules/CompetitorForm';
import type { Competitor } from '@/types/marketResearch';

/** Props for CompetitorDialog. */
export interface CompetitorDialogProps {
  /** Whether the dialog is open. */
  readonly open: boolean;
  /** Competitor to edit, or undefined for create mode. */
  readonly competitor?: Competitor;
  /** Called when the dialog should close. */
  readonly onClose: () => void;
}

/**
 * Modal dialog containing the competitor add/edit form.
 *
 * @param props - CompetitorDialogProps.
 * @returns MUI Dialog with CompetitorForm inside.
 */
export const CompetitorDialog: React.FC<
  CompetitorDialogProps
> = ({ open, competitor, onClose }) => {
  const t = useTranslations('marketResearch');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-label={t('addCompetitor')}
      data-testid="competitor-dialog"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {competitor
          ? t('editCompetitor')
          : t('addCompetitor')}
      </DialogTitle>
      <DialogContent
        style={{ overscrollBehavior: 'contain' }}>
        <CompetitorForm
          initial={competitor}
          onDone={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CompetitorDialog;
