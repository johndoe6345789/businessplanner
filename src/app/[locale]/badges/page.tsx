import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import nextDynamic from 'next/dynamic';

/** Skip static prerendering — data is user-specific. */
export const dynamic = 'force-dynamic';

const BadgeCabinet = nextDynamic(
  () => import('@/components/organisms/BadgeCabinet'),
  {
    loading: () => (
      <div data-testid="badge-cabinet-loading" />
    ),
  },
);

/** Props for the badges page. */
interface BadgesPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Badge cabinet page — shows all system badges
 * with earned/unearned state for the current user.
 *
 * @param props - Page props with locale params.
 * @returns Badges overview UI.
 */
export default async function BadgesPage({
  params,
}: BadgesPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gamification');

  return (
    <Box aria-label={t('badges')}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        {t('badges')}
      </Typography>
      <BadgeCabinet />
    </Box>
  );
}
