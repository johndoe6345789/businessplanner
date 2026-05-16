import type { ReactElement } from 'react';
import {
  setRequestLocale, getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import KpiScorecard
  from '@/components/organisms/KpiScorecard';

export const dynamic = 'force-dynamic';

interface KpiPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * KPI scorecard page at /kpi.
 * Track key performance indicators across all domains.
 *
 * @param props - Page props with locale.
 * @returns KPI scorecard page.
 */
export default async function KpiPage({
  params,
}: KpiPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('kpi');

  return (
    <Box component="main" role="main"
      data-testid="kpi-page"
      aria-label={t('pageTitle')}
      sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('pageTitle')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('pageDescription')}
      </Typography>
      <KpiScorecard />
    </Box>
  );
}
