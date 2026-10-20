'use client';

/**
 * Single swim-lane column for the scoping canvas.
 * @module components/organisms/ScopingLane
 */
import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Paper from '@mui/material/Paper';
import { FeatureCard }
  from '@/components/molecules/FeatureCard';
import type {
  ScopedFeature, FeatureStatus,
} from '@/types/scoping';

/** Props for ScopingLane. */
export interface ScopingLaneProps {
  readonly title: string;
  readonly features: ScopedFeature[];
  readonly emptyLabel: string;
  readonly onEdit: (f: ScopedFeature) => void;
  readonly onDelete: (id: string) => void;
  readonly onStatus: (
    id: string, status: FeatureStatus) => void;
  readonly testId: string;
}

/**
 * Swim-lane column listing features by status.
 * @param props - ScopingLaneProps.
 * @returns Lane column UI.
 */
export const ScopingLane: React.FC<ScopingLaneProps> = (
  {
    title, features, emptyLabel,
    onEdit, onDelete, onStatus, testId,
  },
) => (
  <Paper variant="outlined"
    data-testid={testId}
    role="region"
    aria-label={title}
    sx={{
      flex: '1 1 220px',
      minWidth: 200,
      maxWidth: 320,
      p: 1.5,
      display: 'flex',
      flexDirection: 'column',
    }}>
    <Typography variant="subtitle1"
      sx={{ fontWeight: 700, mb: 1 }}>
      {title}
    </Typography>
    {features.length === 0 ? (
      <Typography variant="caption"
        color="text.secondary"
        data-testid={`${testId}-empty`}>
        {emptyLabel}
      </Typography>
    ) : (
      features.map((f) => (
        <FeatureCard key={f.id} feature={f}
          onEdit={onEdit} onDelete={onDelete}
          onStatus={onStatus} />
      ))
    )}
  </Paper>
);

export default ScopingLane;
