'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import {
  useGetLaunchPadMetricsQuery,
} from '@/store/api/adminApi';
import {
  LaunchPadKpiGrid,
} from './LaunchPadKpiGrid';

/**
 * Admin analytics dashboard organism.
 *
 * Renders a heading, a generated-at caption, and
 * five LaunchPad KPI tiles via LaunchPadKpiGrid.
 *
 * @returns Analytics dashboard element.
 */
const AdminAnalyticsDashboard: React.FC = () => {
  const t = useTranslations('admin.analytics');
  const { data, isLoading } =
    useGetLaunchPadMetricsQuery();

  const loading = isLoading || !data;

  return (
    <Box
      data-testid="admin-analytics-dashboard"
      aria-label={t('title')}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
      >
        {t('title')}
      </Typography>

      {data?.generatedAt && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 2 }}
        >
          {t('generatedAt')}{' '}
          {new Date(
            data.generatedAt,
          ).toLocaleString()}
        </Typography>
      )}

      <LaunchPadKpiGrid
        data={data}
        loading={loading}
      />
    </Box>
  );
};

export default AdminAnalyticsDashboard;
