import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { PricingCalculator }
  from '@/components/organisms/PricingCalculator';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the pricing page. */
interface PricingPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Pricing live calculator page at /financials/pricing.
 *
 * @param props - Page props with locale.
 * @returns Pricing page UI.
 */
export default async function PricingPage({
  params,
}: PricingPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('pricing.title')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('pricing.title')}
      </Typography>
      <PricingCalculator />
    </Box>
  );
}
