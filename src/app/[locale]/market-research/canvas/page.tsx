import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { BusinessModelCanvas }
  from '@/components/organisms/BusinessModelCanvas';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the Business Model Canvas page. */
interface CanvasPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Business Model Canvas page at
 * /market-research/canvas.
 *
 * @param props - Page props with locale.
 * @returns Business Model Canvas page UI.
 */
export default async function CanvasPage({
  params,
}: CanvasPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('marketResearch');

  return (
    <Box component="main" role="main"
      aria-label={t('canvas')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('canvas')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('canvasDesc')}
      </Typography>
      <BusinessModelCanvas />
    </Box>
  );
}
