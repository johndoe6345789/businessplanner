import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { ChannelFitGuide }
  from '@/components/organisms/ChannelFitGuide';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the channels page. */
interface ChannelsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Channel-fit guide page at /channels.
 * Shows acquisition channels suited to the startup type.
 *
 * @param props - Page props with locale.
 * @returns Channels page UI.
 */
export default async function ChannelsPage({
  params,
}: ChannelsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('channels');

  return (
    <Box component="main" role="main"
      data-testid="channels-page"
      aria-label={t('title')}
      sx={{ maxWidth: 960, mx: 'auto',
        width: '100%' }}>
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <ChannelFitGuide />
    </Box>
  );
}
