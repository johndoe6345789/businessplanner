import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { PivotTracker }
  from '@/components/organisms/PivotTracker';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the pivots page. */
interface PivotsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Pivot tracker page at /pivots.
 * Shows a timeline of recorded business pivots.
 *
 * @param props - Page props with locale.
 * @returns Pivots page UI.
 */
export default async function PivotsPage({
  params,
}: PivotsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pivot');

  return (
    <Box component="main" role="main"
      data-testid="pivots-page"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <PivotTracker />
    </Box>
  );
}
