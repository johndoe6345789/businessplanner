import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import AccountingDashboard
  from '@/components/organisms/AccountingDashboard';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

interface AccountingPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * @brief Accounting dashboard page at /accounting.
 *        Integrates Xero and Zelt for RSM-style reporting.
 * @param props - Page props with locale.
 * @returns Accounting dashboard page.
 */
export default async function AccountingPage({
  params,
}: AccountingPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('accounting');

  return (
    <Box
      component="main"
      role="main"
      data-testid="accounting-page"
      aria-label={t('pageTitle')}
      sx={{ maxWidth: 1100, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}
      >
        {t('pageTitle')}
      </Typography>
      <Typography
        variant="body1" color="text.secondary"
        sx={{ mb: 3 }}
      >
        {t('pageDescription')}
      </Typography>
      <AccountingDashboard />
    </Box>
  );
}
