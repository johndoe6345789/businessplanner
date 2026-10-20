import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { TamCalculator }
  from '@/components/organisms/TamCalculator';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the TAM calculator page. */
interface TamPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * TAM / SAM / SOM calculator page at /market-research/tam.
 *
 * @param props - Page props with locale.
 * @returns TAM calculator page UI.
 */
export default async function TamPage({
  params,
}: TamPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('marketResearch');

  return (
    <Box component="main" role="main"
      aria-label={t('tam')}
      sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('tam')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('tamDesc')}
      </Typography>
      <TamCalculator />
    </Box>
  );
}
