import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { BurnRateCalculator }
  from '@/components/organisms/BurnRateCalculator';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the burn rate page. */
interface BurnPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Burn rate calculator page at /financials/burn.
 *
 * @param props - Page props with locale.
 * @returns Burn rate page UI.
 */
export default async function BurnPage({
  params,
}: BurnPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('burn.title')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('burn.title')}
      </Typography>
      <BurnRateCalculator />
    </Box>
  );
}
