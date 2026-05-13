import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';
import ClientPlanExportButton from
  '@/components/atoms/ClientPlanExportButton';

const StartupRoadmap = nextDynamic(
  () => import('@/components/organisms/StartupRoadmap'),
  { loading: () => (
    <div data-testid="planner-loading" />
  ) },
);

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the planner page. */
interface PlannerPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Startup roadmap planner page.
 *
 * @param props - Page props with locale.
 * @returns Planner UI.
 */
export default async function PlannerPage({
  params,
}: PlannerPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('planner');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('pageTitle')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}
    >
      <Box
        sx={{ display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1, flexWrap: 'wrap', gap: 1 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 800 }}
        >
          {t('pageTitle')}
        </Typography>
        <ClientPlanExportButton />
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        {t('pageSubtitle')}
      </Typography>
      <StartupRoadmap />
    </Box>
  );
}
