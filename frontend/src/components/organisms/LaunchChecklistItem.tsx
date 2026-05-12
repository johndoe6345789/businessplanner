'use client';

/**
 * Single item row in the launch execution checklist.
 * @module components/organisms/LaunchChecklistItem
 */
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';
import type { ChecklistItem } from '@/hooks/useLaunchChecklist';

/** Props for LaunchChecklistItem. */
export interface LaunchChecklistItemProps {
  /** Checklist item data. */
  item: ChecklistItem;
  /** Whether this item is completed. */
  checked: boolean;
  /** Called when the checkbox is toggled. */
  onToggle: (id: string) => void;
}

/** Colour map for priority chips. */
const PRIORITY_COLOR = {
  high: 'error',
  medium: 'warning',
  low: 'default',
} as const;

/**
 * Renders a single checklist item with checkbox,
 * title, description, and priority chip.
 *
 * @param props - Component props.
 * @returns Checklist item row.
 */
export const LaunchChecklistItem: React.FC<
  LaunchChecklistItemProps
> = ({ item, checked, onToggle }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
      py: 0.75,
    }}
    data-testid={`launch-checklist-item-${item.id}`}
  >
    <FormControlLabel
      sx={{ m: 0, flexShrink: 0 }}
      control={
        <Checkbox
          checked={checked}
          onChange={() => onToggle(item.id)}
          aria-label={item.title}
          data-testid={`launch-checkbox-${item.id}`}
        />
      }
      label=""
    />
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center',
        gap: 1, flexWrap: 'wrap' }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            textDecoration: checked
              ? 'line-through' : 'none',
            color: checked
              ? 'text.disabled' : 'text.primary',
          }}
        >
          {item.title}
        </Typography>
        <Chip
          label={item.priority}
          size="small"
          color={PRIORITY_COLOR[item.priority]}
          aria-label={`Priority: ${item.priority}`}
        />
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.25, display: 'block' }}
      >
        {item.desc}
      </Typography>
    </Box>
  </Box>
);

export default LaunchChecklistItem;
