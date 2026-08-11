import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { DiscoveryLog }
  from '@/components/organisms/DiscoveryLog';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the Discovery Log page. */
interface DiscoveryPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Discovery log page at /market-research/discovery.
 *
 * @param props - Page props with locale.
 * @returns Discovery log page UI.
 */
export default async function DiscoveryPage({
  params,
}: DiscoveryPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('marketResearch');

  return (
    <Box component="main" role="main"
      aria-label={t('discovery')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('discovery')}
      </Typography>
      <Typography variant="body1"
        color="text.secondary" sx={{ mb: 4 }}>
        {t('discoveryDesc')}
      </Typography>
      <DiscoveryLog />
    </Box>
  );
}
