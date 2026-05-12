import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { CompetitorTracker }
  from '@/components/organisms/CompetitorTracker';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the Competitor Tracker page. */
interface CompetitorsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Competitor tracker page at /market-research/competitors.
 *
 * @param props - Page props with locale.
 * @returns Competitor tracker page UI.
 */
export default async function CompetitorsPage({
  params,
}: CompetitorsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('marketResearch');

  return (
    <Box component="main" role="main"
      aria-label={t('competitors')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('competitors')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('competitorsDesc')}
      </Typography>
      <CompetitorTracker />
    </Box>
  );
}
