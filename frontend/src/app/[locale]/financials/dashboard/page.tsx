import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { FinancialDashboard }
  from '@/components/organisms/FinancialDashboard';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the financial dashboard page. */
interface DashboardPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Financial dashboard page at /financials/dashboard.
 *
 * @param props - Page props with locale.
 * @returns Financial dashboard page UI.
 */
export default async function FinancialsDashboardPage({
  params,
}: DashboardPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      data-testid="financials-dashboard-page"
      aria-label={t('nav.dashboard')}
      sx={{ maxWidth: 1080, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('nav.dashboard')}
      </Typography>
      <FinancialDashboard />
    </Box>
  );
}
