'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Chip } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useKpiDashboard } from '@/hooks/useKpiDashboard';
import KpiAddForm
  from '@/components/molecules/KpiAddForm';
import KpiMetricCard
  from '@/components/molecules/KpiMetricCard';
import KpiUpdateInline
  from '@/components/molecules/KpiUpdateInline';
import type { KpiMetric } from '@/types/kpi';

/**
 * Full KPI scorecard — summary chips, add form,
 * and category groups of metric cards.
 */
const KpiScorecard: React.FC = () => {
  const t = useTranslations('kpi');
  const {
    groups, onTrack, atRisk, offTrack, isLoading,
    createMetric, updateValue, deleteMetric,
  } = useKpiDashboard();
  const [editing, setEditing] = useState<KpiMetric | null>(null);
  return (
    <Box data-testid="kpi-scorecard">
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip color="success" size="small"
          label={`${t('summary.onTrack')}: ${onTrack}`}
          data-testid="kpi-summary-on-track" />
        <Chip color="warning" size="small"
          label={`${t('summary.atRisk')}: ${atRisk}`}
          data-testid="kpi-summary-at-risk" />
        <Chip color="error" size="small"
          label={`${t('summary.offTrack')}: ${offTrack}`}
          data-testid="kpi-summary-off-track" />
      </Box>

      <KpiAddForm isLoading={isLoading}
        onSubmit={(input) => createMetric(input)} />

      {editing && (
        <KpiUpdateInline metric={editing}
          onConfirm={async (v) => {
            await updateValue(
              { id: editing.id, current_value: v });
            setEditing(null);
          }}
          onCancel={() => setEditing(null)} />
      )}

      {groups.map(({ category, metrics }) => (
        <Box key={category} sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t(`category.${category}`)}
          </Typography>
          <Grid container spacing={2}>
            {metrics.map((m) => (
              <Grid item xs={12} sm={6} md={4} key={m.id}>
                <KpiMetricCard metric={m}
                  onUpdate={setEditing}
                  onDelete={(id) => deleteMetric(id)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {!isLoading && groups.length === 0 && (
        <Typography color="text.secondary"
          data-testid="kpi-empty">
          {t('noMetrics')}
        </Typography>
      )}
    </Box>
  );
};

export default KpiScorecard;
