import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { StartupCompareBoard }
  from '@/components/organisms/StartupCompareBoard';
import { CompoundChain }
  from '@/components/organisms/CompoundChain';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the startup comparison page. */
interface StartupComparePageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Startup comparison page at /startup-compare.
 * Ranks company ideas by aggregate risk score.
 *
 * @param props - Page props with locale.
 * @returns Startup comparison page UI.
 */
export default async function StartupComparePage({
  params,
}: StartupComparePageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('startupCompare');

  return (
    <Box
      component="main"
      role="main"
      data-testid="startup-compare-page"
      aria-label={t('pageTitle')}
      sx={{ maxWidth: 800, mx: 'auto',
        width: '100%' }}
    >
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('pageTitle')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 3 }}>
        {t('pageDescription')}
      </Typography>
      <StartupCompareBoard />
      <CompoundChain />
    </Box>
  );
}
