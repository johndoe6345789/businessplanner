'use client';

/**
 * Card displaying a single organisation summary.
 * @module components/molecules/OrgCard
 */
import React from 'react';
import Card from '@shared/m3/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import Chip from '@mui/material/Chip';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import type { Organisation } from '@/types/organisations';
import { ENTITY_TYPE_LABELS }
  from '@/types/organisations';

/** Props for OrgCard. */
interface OrgCardProps {
  /** The organisation to display. */
  readonly org: Organisation;
  /** Called when the edit button is clicked. */
  readonly onEdit: (org: Organisation) => void;
  /** Called when the delete button is clicked. */
  readonly onDelete: (id: string) => void;
}

/**
 * Displays a single organisation with type chips
 * and edit / delete actions.
 *
 * @param props - OrgCard props.
 * @returns Organisation card element.
 */
export const OrgCard: React.FC<OrgCardProps> = ({
  org, onEdit, onDelete,
}) => {
  const t = useTranslations('companies');
  return (
    <Card
      data-testid="org-card"
      aria-label={org.name}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Typography variant="h6">
          {org.name}
        </Typography>
        {org.website && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {org.website}
          </Typography>
        )}
        <Box sx={{ mt: 1, display: 'flex',
          flexWrap: 'wrap', gap: 0.5 }}>
          {org.entity_types.map((et) => (
            <Chip
              key={et}
              label={ENTITY_TYPE_LABELS[et]}
              size="small"
              data-testid="org-type-chip"
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small"
          onClick={() => onEdit(org)}
          aria-label={t('edit')}>
          {t('edit')}
        </Button>
        <Button size="small" color="error"
          onClick={() => onDelete(org.id)}
          aria-label={t('delete')}>
          {t('delete')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrgCard;
