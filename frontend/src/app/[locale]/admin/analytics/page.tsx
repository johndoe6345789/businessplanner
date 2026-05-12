import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import AdminAnalyticsDashboard from
  '@/components/organisms/AdminAnalyticsDashboard';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';

/** Props for the analytics page. */
interface AnalyticsPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Admin analytics page showing LaunchPad KPI tiles.
 *
 * @param props - Page props with locale params.
 * @returns Analytics dashboard page.
 */
export default async function AnalyticsPage({
  params,
}: AnalyticsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin.analytics');

  return (
    <Box
      aria-label={t('title')}
      data-testid="admin-analytics-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('title')}
      </Typography>
      <AdminAnalyticsDashboard />
    </Box>
  );
}
