import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { RevenueModelSelector }
  from '@/components/organisms/RevenueModelSelector';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the revenue model page. */
interface RevenuePageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Revenue model selector page at /financials/revenue.
 *
 * @param props - Page props with locale.
 * @returns Revenue model page UI.
 */
export default async function RevenuePage({
  params,
}: RevenuePageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('nav.revenue')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('nav.revenue')}
      </Typography>
      <RevenueModelSelector />
    </Box>
  );
}
