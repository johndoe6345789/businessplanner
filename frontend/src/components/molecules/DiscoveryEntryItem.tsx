'use client';

/**
 * Single discovery log entry with chips and delete.
 * @module components/molecules/DiscoveryEntryItem
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import Divider from '@shared/m3/Divider';
import { useTranslations } from 'next-intl';
import type { DiscoveryEntry }
  from '@/types/marketResearch';

/** Props for DiscoveryEntryItem. */
export interface DiscoveryEntryItemProps {
  /** Entry data to display. */
  entry: DiscoveryEntry;
  /** Called when delete is clicked. */
  onDelete: (id: string) => void;
  /** Whether to show the trailing divider. */
  showDivider: boolean;
}

/**
 * Renders one discovery interview entry including
 * contact name, date, findings, assumption chips
 * and a delete action.
 *
 * @param props - Component props.
 * @returns DiscoveryEntryItem UI.
 */
export const DiscoveryEntryItem: React.FC<
  DiscoveryEntryItemProps
> = ({ entry: e, onDelete, showDivider }) => {
  const tc = useTranslations('common');
  return (
    <Box data-testid={`discovery-entry-${e.id}`}>
      <Box sx={{ display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle1"
            sx={{ fontWeight: 700 }}>
            {e.contactName}
          </Typography>
          <Typography variant="caption"
            color="text.secondary">
            {e.date}
          </Typography>
        </Box>
        <Button size="small"
          onClick={() => onDelete(e.id)}
          aria-label={tc('delete')}
          data-testid={`discovery-delete-${e.id}`}
          color="error">
          {tc('delete')}
        </Button>
      </Box>
      <Typography variant="body2"
        sx={{ mt: 1, mb: 1 }}>
        {e.keyFindings}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1,
        flexWrap: 'wrap' }}>
        {e.validatedAssumptions.map((v, i) => (
          <Chip key={i} label={v} size="small"
            color="success" variant="outlined" />
        ))}
        {e.invalidatedAssumptions.map((v, i) => (
          <Chip key={i} label={v} size="small"
            color="error" variant="outlined" />
        ))}
      </Box>
      {showDivider && <Divider sx={{ mt: 2 }} />}
    </Box>
  );
};

export default DiscoveryEntryItem;
