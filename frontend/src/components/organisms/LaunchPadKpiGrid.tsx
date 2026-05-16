'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import { useTranslations } from 'next-intl';
import { KpiCard } from
  '@/components/molecules/KpiCard';
import type { LaunchPadMetrics }
  from '@/types/analytics';

/** Props for the LaunchPad KPI grid. */
export interface LaunchPadKpiGridProps {
  /** Metrics payload; undefined while loading. */
  data: LaunchPadMetrics | undefined;
  /** True while the query is in flight. */
  loading: boolean;
}

const fmt    = (n: number) => n.toLocaleString();
const fmtPct = (n: number) => `${n.toFixed(1)}%`;

/**
 * Five KPI tiles for the LaunchPad analytics
 * dashboard, laid out in a MUI Grid.
 *
 * @param props - Grid props.
 * @returns MUI Grid element.
 */
export const LaunchPadKpiGrid: React.FC<
  LaunchPadKpiGridProps
> = ({ data, loading }) => {
  const t = useTranslations('admin.analytics');
  const d = data;
  const tiles = [
    {
      id: 'weeklyActive',
      label: t('weeklyActive'),
      value: loading ? '' : fmt(d!.weeklyActiveFounders),
      icon: 'trending_up',
      intent: 'good' as const,
    },
    {
      id: 'streakRetention',
      label: t('streakRetention'),
      value: loading ? '' : fmtPct(d!.streakRetentionPct),
      icon: 'local_fire_department',
      intent: (!loading && d!.streakRetentionPct >= 50
        ? 'good' : 'watch') as 'good' | 'watch',
    },
    {
      id: 'totalFounders',
      label: t('totalFounders'),
      value: loading ? '' : fmt(d!.totalFounders),
      icon: 'group',
      intent: 'good' as const,
    },
    {
      id: 'hypothesesTracked',
      label: t('hypothesesTracked'),
      value: loading ? '' : fmt(d!.hypothesesTotal),
      icon: 'science',
      intent: 'good' as const,
    },
    {
      id: 'hypothesesValidated',
      label: t('hypothesesValidated'),
      value: loading ? '' : fmt(d!.hypothesesValidated),
      icon: 'check_circle',
      intent: 'good' as const,
    },
  ];

  return (
    <Grid container spacing={2}>
      {tiles.map((tile) => (
        <Grid item xs={12} sm={6} md={4}
          key={tile.id}
        >
          <KpiCard {...tile} loading={loading} />
        </Grid>
      ))}
    </Grid>
  );
};
