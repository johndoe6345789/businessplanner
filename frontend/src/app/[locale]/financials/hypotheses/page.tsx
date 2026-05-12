import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { HypothesisTracker }
  from '@/components/organisms/HypothesisTracker';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the hypotheses page. */
interface HypothesesPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Financial hypothesis tracker page at
 * /financials/hypotheses.
 *
 * @param props - Page props with locale.
 * @returns Hypotheses page UI.
 */
export default async function HypothesesPage({
  params,
}: HypothesesPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('financials');

  return (
    <Box component="main" role="main"
      aria-label={t('hypotheses.title')}
      sx={{ maxWidth: 800, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('hypotheses.title')}
      </Typography>
      <HypothesisTracker />
    </Box>
  );
}
