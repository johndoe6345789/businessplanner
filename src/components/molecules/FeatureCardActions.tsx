'use client';

/**
 * Status + edit/delete action bar for FeatureCard.
 * @module components/molecules/FeatureCardActions
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Chip from '@shared/m3/Chip';
import IconButton from '@shared/m3/IconButton';
import { Edit as EditIcon } from '@shared/icons/Edit';
import { Delete as DeleteIcon }
  from '@shared/icons/Delete';
import { useTranslations } from 'next-intl';
import type {
  ScopedFeature,
  FeatureStatus,
} from '@/types/scoping';

const STATUS_ACTIONS: FeatureStatus[] = [
  'in_mvp', 'later', 'cut',
];

/** Props for FeatureCardActions. */
export interface FeatureCardActionsProps {
  readonly feature: ScopedFeature;
  readonly onEdit: (f: ScopedFeature) => void;
  readonly onDelete: (id: string) => void;
  readonly onStatus: (
    id: string, status: FeatureStatus,
  ) => void;
}

/**
 * Status chips and icon actions for a feature card.
 * @param props - FeatureCardActionsProps.
 * @returns Action row UI.
 */
export const FeatureCardActions: React.FC<
  FeatureCardActionsProps
> = ({ feature, onEdit, onDelete, onStatus }) => {
  const t = useTranslations('scoping');
  const tc = useTranslations('common');

  const label: Record<FeatureStatus, string> = {
    in_mvp: t('inMvp'),
    later: t('later'),
    cut: t('cut'),
    considering: t('considering'),
  };

  return (
    <Box sx={{ display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {STATUS_ACTIONS.map((s) => (
          <Chip key={s} label={label[s]} size="small"
            variant={
              feature.status === s
                ? 'filled' : 'outlined'
            }
            onClick={() => onStatus(feature.id, s)}
            aria-label={`${tc('moveTo')} ${label[s]}`}
            data-testid={
              `feature-card-${feature.id}-${s}`
            }
            sx={{ cursor: 'pointer' }} />
        ))}
      </Box>
      <Box>
        <IconButton size="small"
          onClick={() => onEdit(feature)}
          aria-label={tc('edit')}
          data-testid={
            `feature-card-${feature.id}-edit`
          }>
          <EditIcon size="1rem" />
        </IconButton>
        <IconButton size="small"
          onClick={() => onDelete(feature.id)}
          aria-label={tc('delete')}
          data-testid={
            `feature-card-${feature.id}-delete`
          }>
          <DeleteIcon size="1rem" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FeatureCardActions;
