'use client';

import React from 'react';
import {
  Card, CardContent, Typography, Box, IconButton,
} from '@shared/m3';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslations } from 'next-intl';
import type { KpiMetric } from '@/types/kpi';
import KpiStatusChip from '@/components/atoms/KpiStatusChip';

/** Props for KpiMetricCard. */
export interface KpiMetricCardProps {
  /** The KPI metric to display. */
  readonly metric: KpiMetric;
  /** Called when the user requests a value update. */
  readonly onUpdate: (metric: KpiMetric) => void;
  /** Called when the user deletes the metric. */
  readonly onDelete: (id: string) => void;
}

/** Card showing a KPI metric with status and actions. */
const KpiMetricCard: React.FC<KpiMetricCardProps> = (
  { metric, onUpdate, onDelete },
) => {
  const t = useTranslations('kpi');
  const pct = metric.target_value > 0
    ? Math.round(
        (metric.current_value / metric.target_value)
        * 100)
    : 0;

  return (
    <Card data-testid={`kpi-metric-card-${metric.id}`}>
      <CardContent>
        <Box sx={{ display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start' }}>
          <Typography variant="subtitle2">
            {metric.title}
          </Typography>
          <Box>
            <IconButton size="small"
              aria-label={t('updateValue')}
              data-testid={`kpi-edit-${metric.id}`}
              onClick={() => onUpdate(metric)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small"
              aria-label={t('deleteMetric')}
              data-testid={`kpi-delete-${metric.id}`}
              onClick={() => onDelete(metric.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="h5" sx={{ my: 0.5 }}>
          {metric.current_value}{metric.unit}
          <Typography component="span" variant="body2"
            color="text.secondary">
            {' '}/ {metric.target_value}{metric.unit}
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex',
          alignItems: 'center', gap: 1 }}>
          <KpiStatusChip status={metric.status} />
          <Typography variant="caption"
            color="text.secondary">
            {pct}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KpiMetricCard;
