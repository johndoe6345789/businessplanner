'use client';

import React from 'react';
import Card from '@shared/m3/Card';
import { CardContent } from '@shared/m3/Card';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import Skeleton from '@mui/material/Skeleton';

/** Colour intent for a KPI card. */
export type KpiCardIntent =
  | 'good'
  | 'watch'
  | 'concern';

/** Props for the KpiCard molecule. */
export interface KpiCardProps {
  /** Unique identifier used in data-testid. */
  id: string;
  /** Short label displayed below the value. */
  label: string;
  /** Formatted value string to display large. */
  value: string;
  /** Optional Material icon name. */
  icon?: string;
  /** Colour intent controlling the accent. */
  intent?: KpiCardIntent;
  /** Show a loading skeleton instead of data. */
  loading?: boolean;
}

/** Accent colour map keyed by intent. */
const ACCENT: Record<KpiCardIntent, string> = {
  good:    'primary.main',
  watch:   'warning.main',
  concern: 'error.main',
};

/**
 * A compact KPI tile showing a large metric value
 * and a label, with an optional colour intent.
 *
 * @param props - KpiCard props.
 * @returns KPI card element.
 */
export const KpiCard: React.FC<KpiCardProps> = ({
  id, label, value, icon, intent = 'good', loading,
}) => {
  const accent = ACCENT[intent];

  return (
    <Card
      data-testid={`kpi-card-${id}`}
      aria-label={`${label}: ${value}`}
      sx={{ height: '100%' }}
    >
      <CardContent>
        {icon && (
          <Box
            component="span"
            className="material-icons"
            aria-hidden="true"
            sx={{
              fontSize: 32,
              color: accent,
              display: 'block',
              mb: 1,
            }}
          >
            {icon}
          </Box>
        )}
        {loading ? (
          <Skeleton variant="text" width="60%" height={52} />
        ) : (
          <Typography
            variant="h4"
            component="p"
            sx={{ color: accent, fontWeight: 700 }}
          >
            {value}
          </Typography>
        )}
        {loading ? (
          <Skeleton variant="text" width="80%" />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {label}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
