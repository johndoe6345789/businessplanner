'use client';

/**
 * Save / cancel action row for CompetitorForm.
 * @module components/molecules/CompetitorFormActions
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import { useTranslations } from 'next-intl';

/** Props for CompetitorFormActions. */
interface CompetitorFormActionsProps {
  /** Called when the user clicks Save. */
  readonly onSave: () => void;
  /** Called when the user clicks Cancel. */
  readonly onCancel: () => void;
}

/**
 * Save and cancel buttons for the competitor form.
 *
 * @param props - CompetitorFormActionsProps.
 * @returns Button row UI.
 */
export const CompetitorFormActions: React.FC<
  CompetitorFormActionsProps
> = ({ onSave, onCancel }) => {
  const tc = useTranslations('common');

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button variant="contained"
        onClick={onSave}
        aria-label={tc('save')}
        data-testid="cf-submit">
        {tc('save')}
      </Button>
      <Button onClick={onCancel}
        aria-label={tc('cancel')}
        data-testid="cf-cancel">
        {tc('cancel')}
      </Button>
    </Box>
  );
};

export default CompetitorFormActions;
