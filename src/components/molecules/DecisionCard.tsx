'use client';

/**
 * Card display for a single decision log entry.
 * @module components/molecules/DecisionCard
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import Chip from '@shared/m3/Chip';
import { useTranslations } from 'next-intl';
import type { Decision } from '@/types/decisions';

/** Props for DecisionCard. */
export interface DecisionCardProps {
  /** The decision to display. */
  decision: Decision;
  /** Called when the user clicks Edit. */
  onEdit: (d: Decision) => void;
  /** Called when the user clicks Delete. */
  onDelete: (id: string) => void;
}

/**
 * Card showing a decision summary with edit/delete.
 *
 * @param props - decision, onEdit, onDelete.
 * @returns DecisionCard UI.
 */
export const DecisionCard: React.FC<
  DecisionCardProps
> = ({ decision, onEdit, onDelete }) => {
  const t = useTranslations('decisions');
  const tc = useTranslations('common');

  const date = new Date(
    decision.created_at,
  ).toLocaleDateString();

  return (
    <Box
      data-testid={`decision-card-${decision.id}`}
      aria-label={decision.title}
      sx={{ p: 2, border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1"
            sx={{ fontWeight: 700 }}>
            {decision.title}
          </Typography>
          <Typography variant="caption"
            color="text.secondary">
            {date}
          </Typography>
          {decision.planner_step_id && (
            <Chip
              label={`${t('plannerStep')}: ${decision.planner_step_id}`}
              size="small" sx={{ ml: 1 }}
              data-testid={
                `dec-step-${decision.id}`} />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small"
            onClick={() => onEdit(decision)}
            aria-label={`${tc('edit')} ${decision.title}`}
            data-testid={`dec-edit-${decision.id}`}>
            {tc('edit')}
          </Button>
          <Button size="small" color="error"
            onClick={() => onDelete(decision.id)}
            aria-label={
              `${tc('delete')} ${decision.title}`}
            data-testid={
              `dec-delete-${decision.id}`}>
            {tc('delete')}
          </Button>
        </Box>
      </Box>
      <Typography variant="body2"
        sx={{ mt: 1 }} color="text.secondary">
        {decision.decision}
      </Typography>
    </Box>
  );
};

export default DecisionCard;
