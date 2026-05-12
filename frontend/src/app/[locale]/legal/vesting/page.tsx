import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

const VestingCalculator = nextDynamic(
  () => import(
    '@/components/organisms/VestingCalculator'
  ),
  { loading: () => (
    <div data-testid="vesting-loading" />
  ) },
);

/** Props for the vesting schedule page. */
interface VestingPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Vesting schedule calculator page at
 * /legal/vesting.
 *
 * @param props - Page props with locale.
 * @returns Vesting calculator UI.
 */
export default async function VestingPage({
  params,
}: VestingPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('vestingTitle')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}
      >
        {t('vestingTitle')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
      >
        {t('vestingDesc')}
      </Typography>
      <VestingCalculator />
    </Box>
  );
}
