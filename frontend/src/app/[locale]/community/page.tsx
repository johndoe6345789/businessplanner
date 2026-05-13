import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import BoardGrid from
  '@/components/organisms/BoardGrid';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the community landing page. */
interface CommunityPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Community landing page at /community.
 * Shows the board grid for the LaunchPad forum.
 *
 * @param props - Page props with locale.
 * @returns Community boards page.
 */
export default async function CommunityPage({
  params,
}: CommunityPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('community');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('boards')}
      sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {t('boards')}
      </Typography>
      <BoardGrid />
    </Box>
  );
}
