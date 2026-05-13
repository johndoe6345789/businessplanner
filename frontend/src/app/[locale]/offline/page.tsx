import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import ClientOfflineStreakDisplay from
  '@/components/atoms/ClientOfflineStreakDisplay';

/** Skip static prerendering (uses localStorage). */
export const dynamic = 'force-dynamic';

/** Props for the offline fallback page. */
interface OfflinePageProps {
  /** Route params with locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Offline fallback page shown by the service worker
 * when the user is without network connectivity.
 *
 * To add to precache list, update SHELL in
 * frontend/public/sw.js to include
 * '/app/en/offline' and '/app/en/review'.
 *
 * @param props - Page props with locale.
 * @returns Offline fallback UI.
 */
export default async function OfflinePage({
  params,
}: OfflinePageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('offline');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      sx={{
        maxWidth: 480,
        mx: 'auto',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight={700}
        gutterBottom
      >
        {t('title')}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        {t('message')}
      </Typography>
      <ClientOfflineStreakDisplay />
    </Box>
  );
}
