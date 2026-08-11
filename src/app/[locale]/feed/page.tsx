import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import ActivityFeed from
  '@/components/organisms/ActivityFeed';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the activity feed page. */
interface FeedPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Activity feed page at /feed.
 * Shows recent forum threads as activity items.
 *
 * @param props - Page props with locale.
 * @returns Activity feed page.
 */
export default async function FeedPage({
  params,
}: FeedPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('feed');

  return (
    <Box
      component="main"
      role="main"
      data-testid="feed-page"
      aria-label={t('title')}
      sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800 }}
      >
        {t('title')}
      </Typography>
      <ActivityFeed />
    </Box>
  );
}
