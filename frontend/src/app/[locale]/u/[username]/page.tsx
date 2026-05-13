import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box } from '@shared/m3';
import nextDynamic from 'next/dynamic';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

const FounderProfilePage = nextDynamic(
  () => import(
    '@/components/organisms/FounderProfilePageClient'
  ),
  { ssr: false },
);

/** Props for the founder public profile page. */
interface ProfileRouteProps {
  /** Route params with locale and username. */
  readonly params: Promise<{
    locale: string;
    username: string;
  }>;
}

/**
 * Public founder profile page at /u/{username}.
 * No authentication required.
 *
 * @param props - Page props with route params.
 * @returns Founder profile page UI.
 */
export default async function FounderPublicPage({
  params,
}: ProfileRouteProps): Promise<ReactElement> {
  const { locale, username } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('founderProfile');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('pageLabel')}
      sx={{ maxWidth: 600, mx: 'auto', py: 4 }}
    >
      <FounderProfilePage username={username} />
    </Box>
  );
}
