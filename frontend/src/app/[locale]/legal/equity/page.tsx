import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

const EquityCalculator = nextDynamic(
  () => import(
    '@/components/organisms/EquityCalculator'
  ),
  { loading: () => (
    <div data-testid="equity-loading" />
  ) },
);

/** Props for the equity split page. */
interface EquityPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Equity split calculator page at /legal/equity.
 *
 * @param props - Page props with locale.
 * @returns Equity split calculator UI.
 */
export default async function EquityPage({
  params,
}: EquityPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('equityTitle')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}
      >
        {t('equityTitle')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
      >
        {t('equityDesc')}
      </Typography>
      <EquityCalculator />
    </Box>
  );
}
